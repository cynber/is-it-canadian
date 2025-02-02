import { createContentLoader } from 'vitepress';

const data = createContentLoader('blog/**/*.md', {
    transform(rawData) {
        return rawData.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    }
});

export default data;