export function SocialLinks() {
  const links = [
    { name: 'Facebook', url: 'https://facebook.com/oliverprada', color: 'hover:text-blue-400' },
    { name: 'Instagram', url: 'https://instagram.com/oliverprada', color: 'hover:text-pink-400' },
    { name: 'TikTok', url: 'https://tiktok.com/@oliverprada', color: 'hover:text-purple-400' },
    { name: 'GitHub', url: 'https://github.com/oliversantiagoprada', color: 'hover:text-gray-200' },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`bg-dark-800 border border-dark-700 px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 ${link.color} transition-colors`}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}
