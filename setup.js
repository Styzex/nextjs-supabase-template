const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
const exec = (command) => {
  execSync(command, { stdio: 'inherit' });
};

// Create Next.js app
console.log('Creating Next.js app...');
exec('npx create-next-app@latest my-next-app');

// Navigate into the app directory
process.chdir('my-next-app');

// Install Supabase client
console.log('Installing Supabase client...');
exec('npm install @supabase/supabase-js');

// Create Supabase helper file
console.log('Setting up Supabase helper...');
const supabaseDir = path.join('lib');
if (!fs.existsSync(supabaseDir)) {
  fs.mkdirSync(supabaseDir);
}
fs.writeFileSync(path.join(supabaseDir, 'supabase.js'), `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
`);

// Add example usage in pages/index.js
console.log('Creating example page...');
fs.writeFileSync('pages/index.js', `
import { supabase } from '../lib/supabase';

export default function Home({ posts }) {
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

export async function getStaticProps() {
  let { data: posts, error } = await supabase
    .from('posts')
    .select('*');

  if (error) console.log('Error fetching posts:', error);

  return {
    props: {
      posts,
    },
  };
}
`);

// Create .env.local file
console.log('Creating .env.local file...');
fs.writeFileSync('.env.local', `
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
`);

console.log('Setup complete. Please update your .env.local file with your Supabase URL and Key.');
