// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define allowed file types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req: Request) {
  try {
    // // Get current user from session for auth check
    // const session = await getServerSession(authOptions);
    
    // if (!session || !session.user || session.user.role !== 'admin') {
    //   return new Response(JSON.stringify({ error: 'Unauthorized. Admin access required.' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    // }
    
    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    // Validate file existence
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'File type not allowed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size exceeds 1MB limit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    
    // Save to public directory
    const path = join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(path, buffer);
    
    // Return the URL to the saved file
    const url = `/uploads/${filename}`;
    
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}