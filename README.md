# deuspoeticus.github.io

A data-driven, interactive portfolio for a creative technologist focused on the intersection of design, code, and language.

## 🚀 Overview

This project is a custom-built portfolio powered by **Jekyll** and **GitHub Pages**. It features a unique terminal-inspired UI with an interactive generative background powered by the HTML5 Canvas API.

## 🛠️ Technical Architecture

### Data-Driven UI
The portfolio content is decoupled from the presentation layer using Jekyll's data system:
- **`_data/portfolio.yml`**: Contains project identifiers, links, and metadata for the works showcase.
- **`_data/vitae.yml`**: Manages education and professional engagements.
- **`_data/bio.yml`**: Stores biographical sections and contact information.

### Generative Core (`script.js`)
The "Ordo ab Chao" background is a custom particle system that:
- Uses a unified buffer for pixel manipulation.
- Implements a responsive grid that adapts to mobile and desktop viewports.
- Features a custom UI panel (hidden by default) for real-time parameter exploration (turbulence, speed, point density).
- Persists user preferences using `localStorage`.

### Performance & Style
- **Typography**: Uses Geist Mono and custom slab-serif fonts (`TrenchSlab`) to maintain a technical aesthetic.
- **Responsive Design**: Leverages CSS Grid and Flexbox with relative units (`rem`, `vh`) for cross-device compatibility.
- **Optimized Assets**: Fonts are preloaded, and images are lazy-loaded to ensure fast initial paint.

## 💻 Development

### Prerequisites
- Ruby & Bundler (for Jekyll local development)

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/deuspoeticus/deuspoeticus.github.io.git
   ```
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```
4. Visit `http://localhost:4000` to preview.

## 📁 Repository Structure
- `/mobius/`, `/wild-automaton/`: Interactive sub-experiments integrated as standalone components.
- `assets/`: Image assets, project screenshots, and custom web fonts.
- `_site/`: Generated static site (ignored by Git).

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
