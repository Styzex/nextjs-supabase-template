const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
const exec = (command) => {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
};

// Create Next.js app with TypeScript
exec('npx create-next-app@latest my-next-app --typescript');

// Navigate into the app directory
process.chdir('my-next-app');

// Install Supabase client
exec('npm install @supabase/supabase-js');

// Ensure 'pages' directory exists
const pagesDir = path.join(process.cwd(), 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir);
}

// Example usage in pages/index.tsx
fs.writeFileSync(path.join(pagesDir, 'index.tsx'), `
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      let { data: posts, error } = await supabase
        .from<Post>('posts')
        .select('*');

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(posts || []);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
`);

// Create .env.local file
fs.writeFileSync('.env.local', `
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
`);

console.log('Setup complete.');
