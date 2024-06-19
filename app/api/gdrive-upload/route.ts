import natural from 'natural';
import { NextRequest, NextResponse } from 'next/server';
import * as sw from 'stopword';
import nlp from 'compromise';

// Function to extract keywords from text
const extractKeywords = (text: string): string[] => {
    // Tokenize the text
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text);

    // Remove stopwords
    const filteredTokens = sw.removeStopwords(tokens);

    // Use compromise for POS tagging and NER
    const doc = nlp(filteredTokens.join(' '));

    // Extract nouns, named entities, and key phrases
    const nouns = doc.nouns().out('array');
    const entities = doc.topics().out('array');

    // Find sequences of nouns that form phrases
    const keyPhrases = doc.match('(#Noun|#Adjective|#Determiner|#Value)+').out('array');

    const allKeywords = [...new Set([...nouns, ...entities, ...keyPhrases])];

    // Calculate TF-IDF scores
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    tfidf.addDocument(filteredTokens);

    const keywordScores: { term: string; tfidf: number }[] = [];

    tfidf.listTerms(0).forEach(item => {
        if (allKeywords.includes(item.term)) {
            keywordScores.push({ term: item.term, tfidf: item.tfidf });
        }
    });

    // Sort by tfidf score in descending order
    keywordScores.sort((a, b) => b.tfidf - a.tfidf);

    // Extract top N keywords (e.g., top 10)
    const topKeywords = keywordScores.slice(0, 10).map(item => item.term);

    return topKeywords;
};

// Function to provide recommendations based on keywords
const getRecommendations = (keywords: string[]): string[] => {
    const resources = [
        { keyword: 'project', recommendation: 'Project Management Tools' },
        { keyword: 'team', recommendation: 'Team Building Activities' },
        { keyword: 'deadline', recommendation: 'Time Management Techniques' },
        { keyword: 'black', recommendation: 'more black' },
    ];

    const recommendations: string[] = [];

    keywords.forEach(keyword => {
        resources.forEach(resource => {
            if (keyword.includes(resource.keyword)) {
                recommendations.push(resource.recommendation);
            }
        });
    });

    // Remove duplicates and return
    return [...new Set(recommendations)];
};

export async function GET(request: NextRequest) {

    const transcription = "Krishna is a major Hindu god. Often called Lord Krishna, he is one of the most widely worshiped and popular Hindu deities. Krishna is the eighth avatar (or incarnation) of Vishnu. He was deified in the 5th century and since then has also been worshiped as the supreme god himself. Krishna is the Hindu god of compassion, protection, and love.Also called the Dark One, Krishna is an important character in many Hindu sacred texts, including the Bhagavad Gita. He is portrayed in various ways in Indian mythology and art, from child-god to divine lover, prankster to hero. However, there are three main stages of incarnation within the story of Krishna: the baby, the lover, and the sage. These three stages are believed to symbolize key aspects of his significance and power within Hindu mythology.Krishna is known by 108 different names and emanations, many of which reflect his attributes and mythological associations. The name Krishna itself means black or dark blue. Some of his more popular epithets are Mohan, the enchanter, Govinda, the chief herdsman, Keev, the prankster. Some epithets and names are used only in specific geographical locations. One example is Jagannatha, a name popular in the Odisha state region of India. The honorary title Sri is often placed before the name Krishna, meaning Lord.";

    const keywords = extractKeywords(transcription);
    const recommendations = getRecommendations(keywords);

    console.log('Extracted Keywords:', keywords);
    console.log('Recommendations:', recommendations);

    return NextResponse.json({ keywords, recommendations });
}
