import { useQuery } from '@tanstack/react-query';
import { contentService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <a href="https://facebook.com/oliverprada" target="_blank" rel="noopener" className="text-gray-400 hover:text-white">Facebook</a>
      <a href="https://instagram.com/oliverprada" target="_blank" rel="noopener" className="text-gray-400 hover:text-white">Instagram</a>
      <a href="https://tiktok.com/@oliverprada" target="_blank" rel="noopener" className="text-gray-400 hover:text-white">TikTok</a>
    </div>
  );
}
