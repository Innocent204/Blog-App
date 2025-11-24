import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTheme } from '../contexts/ThemeContext';
import './PostEditor.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Undo, 
  Redo,
  Quote,
  Code,
  Sparkles,
  ArrowLeft,
  PenTool,
  FileText
} from 'lucide-react';
import { Post, Category } from '../types';

interface PostEditorProps {
  post?: Post | null;
  categories: Category[];
  onSave: (post: Partial<Post>) => void;
  onCancel: () => void;
}

export function PostEditor({ post, categories, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = React.useState(post?.title || '');
  const [excerpt, setExcerpt] = React.useState(post?.excerpt || '');
  const [categoryId, setCategoryId] = React.useState(post?.category_id?.toString() || '');
  const [status, setStatus] = React.useState<'draft' | 'published'>(post?.status || 'draft');

  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.content || '<p>Start writing your post...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-base',
        'data-theme': theme,
      },
    },
  });

  // Update editor theme when theme changes
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: `prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-base ${theme === 'dark' ? 'dark' : ''}`,
            'data-theme': theme,
          },
        },
      });
    }
  }, [theme, editor]);

  useEffect(() => {
    if (post && editor) {
      editor.commands.setContent(post.content);
    }
  }, [post, editor]);

  const handleSave = () => {
    if (!editor) return;

    const postData: Partial<Post> = {
      id: post?.id,
      title,
      excerpt,
      content: editor.getHTML(),
      category_id: parseInt(categoryId),
      status,
    };

    onSave(postData);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onCancel}
            className="border-primary/20 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300">
                <div className="flex items-center gap-0.5">
                  <PenTool className="w-3 h-3 text-white" strokeWidth={2.5} />
                  <FileText className="w-2.5 h-2.5 text-white/80" strokeWidth={2} />
                </div>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {post ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="bg-input-background border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post..."
              className="bg-input-background border-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
                <SelectTrigger className="bg-input-background border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <Separator className="mt-4 bg-primary/20" />
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`${editor.isActive('bold') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`${editor.isActive('italic') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`${editor.isActive('bulletList') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`${editor.isActive('orderedList') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`${editor.isActive('blockquote') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <Quote className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`${editor.isActive('codeBlock') ? 'bg-primary/20 border-primary' : 'border-primary/20'} hover:bg-primary/10`}
            >
              <Code className="w-4 h-4" />
            </Button>
            <div className="ml-auto flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="post-editor border border-primary/20 rounded-lg bg-input-background dark:bg-slate-800">
            <EditorContent editor={editor} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-primary/20 hover:bg-primary/10"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </div>
  );
}