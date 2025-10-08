-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create appointments table
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  type text NOT NULL,
  urgency text NOT NULL DEFAULT 'Routine',
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'completed', 'cancelled')),
  submitted_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own appointments
CREATE POLICY "Patients can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

-- Patients can create appointment requests
CREATE POLICY "Patients can create appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own pending appointments
CREATE POLICY "Patients can update their own pending appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = patient_id AND status = 'pending');

-- Doctors can view appointments where they are the doctor
CREATE POLICY "Doctors can view their appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = doctor_id);

-- Doctors can update appointments where they are the doctor
CREATE POLICY "Doctors can update their appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = doctor_id);

-- Admins can view all appointments
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all appointments
CREATE POLICY "Admins can update all appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();