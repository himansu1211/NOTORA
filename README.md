# Notora - Modern Notes App

A sleek, feature-rich notes application built with HTML, CSS, and JavaScript. Notora provides an intuitive interface for creating, managing, and sharing notes with advanced formatting options.

## 🌟 Features

### 📝 Core Functionality
- **Rich Text Editor**: Full-featured WYSIWYG editor with formatting toolbar
- **Note Management**: Create, edit, save, and delete notes
- **Search & Filter**: Find notes quickly with search and filter options
- **Pin Important Notes**: Mark notes as pinned for easy access
- **Real-time Clock**: Live clock display in the navigation bar

### 🎨 Customization
- **Text Formatting**: Bold, italic, underline, font sizes, text colors, and background colors
- **Note Background Colors**: Choose from 8 different background colors for notes
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📤 Sharing & Export
- **Share as Text**: Share note content as plain text
- **Share as Image**: Generate and share notes as images
- **Web Share API**: Native sharing on supported devices

### 🗂️ Organization
- **Calendar Integration**: View notes by date
- **Checklist Support**: Create and manage checklists
- **Categories**: Filter notes by type (pinned, today, checklists)

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (recommended for full functionality)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/notora.git
   cd notora
   ```

2. **Open in browser:**
   - Open `index.html` in your web browser
   - For full functionality, serve via a local web server:
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve .

     # Using PHP
     php -S localhost:8000
     ```

3. **Navigate to:** `http://localhost:8000`

## 📖 Usage

### Creating Notes
1. Click the **+** button to create a new note
2. Enter a title and start writing
3. Use the formatting toolbar for rich text editing
4. Choose background colors from the color picker
5. Click **Save Note** to store your note

### Formatting Text
- **Bold, Italic, Underline**: Click the respective buttons
- **Font Size**: Select from Small to Extra Large
- **Text Color**: Choose from 7 available colors
- **Background Color**: Highlight text and select background color
- **Lists**: Create bulleted or numbered lists
- **Alignment**: Left, center, or right align text
- **Images**: Insert images into your notes

### Managing Notes
- **Search**: Use the search bar to find notes by title or content
- **Filter**: Use filter buttons for pinned notes, today's notes, or checklists
- **Pin Notes**: Click the pin icon to mark important notes
- **Delete Notes**: Click the delete icon on notes you want to remove

### Sharing Notes
- **Text Sharing**: Click "📄 Share Text" to share note content as plain text
- **Image Sharing**: Click "🖼️ Share Image" to generate and share a visual image of your note

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS variables and transitions
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation
- **html2canvas**: For generating note images
- **Web Share API**: Native sharing capabilities

### File Structure
```
notora/
├── index.html          # Main notes page
├── note-editor.html    # Note creation/editing interface
├── calendar.html       # Calendar view
├── checklist.html      # Checklist management
├── styles.css          # Application styling
├── script.js           # Core functionality
└── logo.jpg           # Application logo
```

### Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🎨 Customization

### Themes
The app supports both light and dark themes. Toggle using the moon/sun icon in the navigation bar.

### Color Schemes
- **Light Theme**: Clean white background with dark text
- **Dark Theme**: Dark background with light text for reduced eye strain

### Note Colors
Choose from 8 predefined background colors:
- White (default)
- Yellow
- Green
- Blue
- Red
- Purple
- Orange
- Gray

## 🔧 Development

### Local Development
1. Make changes to HTML, CSS, or JavaScript files
2. Test in your browser
3. Refresh to see changes (no build process required)

### Adding Features
- Modify `script.js` for new functionality
- Update `styles.css` for styling changes
- Edit HTML files for UI modifications

## 📱 Mobile Support

Notora is fully responsive and works on:
- Smartphones (iOS/Android)
- Tablets
- Desktop computers

Touch-friendly interface with optimized button sizes and spacing.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons from Unicode emoji
- html2canvas library for image generation
- Inspired by modern note-taking applications

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the browser console for error messages
- Ensure you're using a modern web browser

---

**Enjoy creating beautiful, organized notes with Notora!** 📝✨
