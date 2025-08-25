import { useState, useRef } from "react";
import {
  Save,
  Upload,
  X,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  Link,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
  published: boolean;
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

export default function BlogEditor({
  post,
  onSave,
  onCancel,
}: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    excerpt: "",
    content: "",
    author: "ASCOSEMI Team",
    publishDate: new Date().toISOString().split("T")[0],
    readTime: "5 min read",
    image: "",
    tags: [],
    featured: false,
    published: false,
    ...post,
  });

  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Calculate read time based on content length
    const wordsPerMinute = 200;
    const wordCount = formData.content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

    const finalPost = {
      ...formData,
      id: formData.id || Date.now().toString(),
      readTime: `${readTimeMinutes} min read`,
      publishDate: formData.published
        ? formData.publishDate
        : new Date().toISOString().split("T")[0],
    };

    onSave(finalPost);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData((prev) => ({
          ...prev,
          image: result.data.url,
        }));
        console.log("✅ Image uploaded successfully:", result.data.url);
      } else {
        const errorMessage =
          result.error || `HTTP ${response.status}: Upload failed`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      alert(`Error uploading image: ${errorMessage}`);
    } finally {
      setImageUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById(
      "content-editor",
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = formData.content;
      const newContent =
        content.substring(0, start) + text + content.substring(end);

      setFormData((prev) => ({ ...prev, content: newContent }));

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {post ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {isPreview ? "Edit Mode" : "Preview"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div className="bg-card border border-border-subtle rounded-lg p-8">
          <div className="mb-6">
            {formData.image && (
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
                onError={(e) => {
                  console.error(
                    "Preview image failed to load:",
                    formData.image,
                  );
                  // Replace with fallback image instead of hiding
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%236b7280'/%3E%3Ctext x='400' y='280' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-size='24'%3EImage Not%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-size='24'%3EAvailable%3C/text%3E%3C/svg%3E";
                }}
              />
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{formData.author}</span>
              <span>•</span>
              <span>{new Date(formData.publishDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{formData.readTime}</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {formData.title || "Untitled Post"}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {formData.excerpt}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-foreground">
              {formData.content}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                      placeholder="Enter blog post title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          excerpt: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground h-20"
                      placeholder="Brief description of the post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Content *
                    </label>

                    {/* Formatting Toolbar */}
                    <div className="border border-border rounded-t-lg p-2 bg-muted/50 flex gap-2">
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("**Bold Text**")}
                        className="p-2 hover:bg-background rounded"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("*Italic Text*")}
                        className="p-2 hover:bg-background rounded"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("# Heading\n\n")}
                        className="p-2 hover:bg-background rounded"
                        title="Heading"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTextAtCursor("- List item\n")}
                        className="p-2 hover:bg-background rounded"
                        title="List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertTextAtCursor("[Link Text](https://example.com)")
                        }
                        className="p-2 hover:bg-background rounded"
                        title="Link"
                      >
                        <Link className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      id="content-editor"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-border border-t-0 rounded-b-lg bg-background text-foreground h-96 font-mono text-sm"
                      placeholder="Write your blog post content here... You can use Markdown formatting."
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          publishDate: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium text-foreground"
                    >
                      Featured Post
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          published: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="published"
                      className="text-sm font-medium text-foreground"
                    >
                      Publish immediately
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.image ? (
                    <div className="space-y-3">
                      <img
                        src={formData.image}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            formData.image,
                          );
                          // Replace with fallback image instead of hiding
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%236b7280'/%3E%3Ctext x='400' y='280' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-size='24'%3EImage Not%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' dy='0.3em' fill='white' font-family='Arial, sans-serif' font-size='24'%3EAvailable%3C/text%3E%3C/svg%3E";
                        }}
                        onLoad={() => {
                          console.log(
                            "Image loaded successfully:",
                            formData.image,
                          );
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="w-full"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="w-full"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground text-sm"
                      placeholder="Add tag..."
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {formData.published ? "Publish Post" : "Save Draft"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
