const fs = require('fs');
const files = [
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/authors/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/books/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/genres/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/authors/edit.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/books/edit.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/genres/edit.jsx'
];

const oldClass = 'className="bg-[#f5f5f7] border border-transparent text-gray-900 text-sm rounded-xl focus:bg-white focus:border-[#538dc6] focus:ring-4 focus:ring-blue-100 block w-full p-3 transition-all"';
const newClass = 'className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(oldClass).join(newClass);
  fs.writeFileSync(file, content);
});
console.log('Replaced successfully!');
