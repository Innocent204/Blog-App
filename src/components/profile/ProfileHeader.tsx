import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Link as LinkIcon, MapPin, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface ProfileHeaderProps {
  profile: {
    avatar_url?: string;
    full_name?: string;
    username?: string;
    bio?: string;
    website?: string;
    location?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    created_at?: string;
    stats?: {
      bookmarks?: number;
      reactions?: number;
    };
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
          <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
          <AvatarFallback className="text-2xl font-bold">
            {getInitials(profile.full_name || profile.username || '')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name || 'Anonymous'}</h1>
              <p className="text-muted-foreground">@{profile.username || 'user'}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/profile/settings">Edit Profile</Link>
            </Button>
          </div>

          {profile.bio && (
            <p className="mt-4 text-foreground">{profile.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <LinkIcon className="h-4 w-4" />
                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {profile.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(profile.created_at)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            {profile.twitter && (
              <a 
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {profile.github && (
              <a 
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.linkedin && (
              <a 
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="mt-6 flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats?.bookmarks || 0}</div>
              <div className="text-sm text-muted-foreground">Bookmarks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats?.reactions || 0}</div>
              <div className="text-sm text-muted-foreground">Reactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
