/**
 * Rich text rendering utilities
 * Handles rendering of lexical editor format content
 */

import { createElement, type ReactNode } from 'react';

// Function to render rich text (lexical editor) format as HTML
export const renderRichText = (richTextObj: any): ReactNode => {
  if (!richTextObj || !richTextObj.root || !richTextObj.root.children) {
    return null;
  }

  const renderNode = (node: any, index: number): ReactNode => {
    if (node.type === 'text') {
      let text: ReactNode = node.text || '';

      // Apply text formatting
      if (node.format & 1) text = <strong>{text}</strong>; // Bold
      if (node.format & 2) text = <em>{text}</em>; // Italic
      if (node.format & 8) text = <u>{text}</u>; // Underline
      if (node.format & 16) text = <s>{text}</s>; // Strikethrough

      return text;
    }

    if (node.type === 'paragraph') {
      const children = node.children ? node.children.map((child: any, childIndex: number) => renderNode(child, childIndex)) : [];
      return (
        <p key={index} className="mb-4 last:mb-0">
          {children}
        </p>
      );
    }

    if (node.type === 'heading') {
      const children = node.children ? node.children.map((child: any, childIndex: number) => renderNode(child, childIndex)) : [];
      const HeadingTag = node.tag || 'h2';

      const headingClasses = {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-3',
        h4: 'text-lg font-bold mb-2',
        h5: 'text-base font-bold mb-2',
        h6: 'text-sm font-bold mb-2'
      };

      return createElement(
        HeadingTag,
        {
          key: index,
          className: headingClasses[HeadingTag as keyof typeof headingClasses] || headingClasses.h2
        },
        children
      );
    }

    if (node.type === 'list') {
      const children = node.children ? node.children.map((child: any, childIndex: number) => renderNode(child, childIndex)) : [];
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <ListTag key={index} className="list-disc list-inside mb-4 space-y-1">
          {children}
        </ListTag>
      );
    }

    if (node.type === 'listitem') {
      const children = node.children ? node.children.map((child: any, childIndex: number) => renderNode(child, childIndex)) : [];
      return (
        <li key={index} className="ml-4">
          {children}
        </li>
      );
    }

    if (node.type === 'link') {
      const children = node.children ? node.children.map((child: any, childIndex: number) => renderNode(child, childIndex)) : [];
      return (
        <a
          key={index}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    }

    // Handle line breaks
    if (node.type === 'linebreak') {
      return <br key={index} />;
    }

    // Fallback for unknown types - render children if they exist
    if (node.children) {
      return (
        <div key={index}>
          {node.children.map((child: any, childIndex: number) => renderNode(child, childIndex))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rich-text-content">
      {richTextObj.root.children.map((child: any, index: number) => renderNode(child, index))}
    </div>
  );
};
