const fs = require('fs');
const files = [
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/authors/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/books/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/genres/create.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/authors/edit.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/books/edit.jsx',
  'C:/xampp/htdocs/bnsp/frontend/src/pages/admin/genres/edit.jsx'
];

const oldClass = "bg-[#f5f5f7] border border-transparent text-gray-900 text-sm rounded-xl focus:bg-white focus:border-[#538dc6] focus:ring-4 focus:ring-blue-100 block w-full p-3 transition-all";
const newClass = "form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(new RegExp(oldClass.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newClass);
  content = content.replace(/apple-card max-w-2xl px-6 py-8 mx-auto mt-6/g, 'apple-card w-full sm:max-w-md mx-auto p-6 sm:p-8 space-y-4 md:space-y-6 mt-6');
  content = content.replace(/className=\"apple-btn apple-btn-primary px-6 py-2\.5\"/g, 'className=\"podia-btn podia-btn-black w-full py-4 text-base font-bold shadow-lg\"');
  fs.writeFileSync(file, content);
});
console.log('Replaced!');
