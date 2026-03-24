-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-ahhdeyjp6akh_opserdecor_images',
  'app-ahhdeyjp6akh_opserdecor_images',
  true,
  1048576, -- 1MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
);

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'app-ahhdeyjp6akh_opserdecor_images');

CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'app-ahhdeyjp6akh_opserdecor_images' 
    AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'app-ahhdeyjp6akh_opserdecor_images' 
    AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'app-ahhdeyjp6akh_opserdecor_images' 
    AND is_admin(auth.uid())
  );