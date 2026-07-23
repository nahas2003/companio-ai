ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'sources');

DROP POLICY IF EXISTS "Public Read" ON storage.objects;
CREATE POLICY "Public Read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'sources');

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'sources');
