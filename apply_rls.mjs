import { createDatabaseClient } from "./db-client.mjs";


async function applyRLS() {
  const client = createDatabaseClient();
  
  try {
    await client.connect();
    
    const sql = `
      DROP POLICY IF EXISTS "Public access to school teachers" ON public.school_teachers;
      CREATE POLICY "Public access to school teachers" ON public.school_teachers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Public access to school classes" ON public.school_classes;
      CREATE POLICY "Public access to school classes" ON public.school_classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Public access to school students" ON public.school_students;
      CREATE POLICY "Public access to school students" ON public.school_students FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Public access to school attendance" ON public.school_attendance;
      CREATE POLICY "Public access to school attendance" ON public.school_attendance FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
    `;
    
    await client.query(sql);
    console.log('Successfully applied permissive RLS for Dev environment.');
  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

applyRLS();
