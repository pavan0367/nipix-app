import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  Calculator,
  Search,
  Download,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  'All Materials',
  'Computer Science & AI',
  'Engineering & Math',
  'Web & Systems',
  'Data Structures & Algo',
  'Cheatsheets'
];

const STUDY_MATERIALS = [
  {
    id: 1,
    category: 'Computer Science & AI',
    title: 'Transformer Architecture & Attention Mechanisms',
    author: 'Prof. A. Vaswani et al. Summary',
    description: 'Comprehensive study guide breakdown on Self-Attention, Multi-Head Attention, positional encodings, and encoder-decoder feedforward networks.',
    tags: ['AI', 'Deep Learning', 'PyTorch'],
    readTime: '8 min read',
    codeSnippet: `# Scaled Dot-Product Attention in Python/PyTorch
import torch
import torch.nn.functional as F

def attention(query, key, value, mask=None):
    d_k = query.size(-1)
    scores = torch.matmul(query, key.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    p_attn = F.softmax(scores, dim=-1)
    return torch.matmul(p_attn, value), p_attn`,
    keyPoints: [
      'Query (Q), Key (K), and Value (V) projections',
      'Scaling factor 1/sqrt(d_k) prevents vanishing gradients in softmax',
      'Allows O(1) sequential path length compared to RNNs'
    ]
  },
  {
    id: 2,
    category: 'Data Structures & Algo',
    title: 'Graph Traversal & Shortest Path: Dijkstra vs A*',
    author: 'Nipix CS Lab',
    description: 'Detailed analysis of greedy shortest-path algorithms with min-heaps, time complexity proofs, and heuristic admissibility criteria for A* search.',
    tags: ['Algorithms', 'Graphs', 'Optimization'],
    readTime: '6 min read',
    codeSnippet: `// Dijkstra's Algorithm (Priority Queue)
function dijkstra(graph, start) {
  const distances = {};
  const pq = new PriorityQueue();
  distances[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { node, dist } = pq.dequeue();
    for (const [neighbor, weight] of graph[node]) {
      const newDist = dist + weight;
      if (newDist < (distances[neighbor] ?? Infinity)) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  return distances;
}`,
    keyPoints: [
      'Time Complexity: O((V + E) log V) using binary heap',
      'Requires non-negative edge weights (use Bellman-Ford for negative weights)',
      'A* incorporates heuristic h(n) <= true remaining cost (admissible)'
    ]
  },
  {
    id: 3,
    category: 'Engineering & Math',
    title: 'Calculus III: Vector Fields & Green’s Theorem',
    author: 'Applied Math Dept.',
    description: 'Visual intuition and mathematical proof connecting double integrals across planar regions to line integrals around piece-wise smooth boundary curves.',
    tags: ['Mathematics', 'Physics', 'Vector Calculus'],
    readTime: '10 min read',
    codeSnippet: `∮_C (L dx + M dy) = ∬_D ((∂M/∂x) - (∂L/∂y)) dA

Curl in 2D: curl(F) = (∂M/∂x - ∂L/∂y)
Divergence Form: ∮_C F · n ds = ∬_D div(F) dA`,
    keyPoints: [
      'Circulation-curl form evaluates rotational work around closed loops',
      'Flux-divergence form quantifies net field outflow across borders',
      'Foundation for Maxwell\'s equations and electrodynamics'
    ]
  },
  {
    id: 4,
    category: 'Web & Systems',
    title: 'Database Indexing & B-Tree Storage Engines',
    author: 'Systems Architecture',
    description: 'How modern RDBMS (PostgreSQL, MySQL InnoDB) structure clustered indices, balance B+ Tree node allocations, and optimize range scans.',
    tags: ['Databases', 'SQL', 'Performance'],
    readTime: '7 min read',
    codeSnippet: `-- Optimizing composite index on multi-column queries
CREATE INDEX idx_user_created ON posts (user_id, created_at DESC);

-- Query uses index range scan without temporary filesort
EXPLAIN SELECT id, caption, created_at 
FROM posts 
WHERE user_id = 42 
ORDER BY created_at DESC 
LIMIT 20;`,
    keyPoints: [
      'B+ Trees store all payload data in leaf nodes for faster sequential scans',
      'Index column ordering must follow leftmost prefix rule',
      'Avoid SELECT * to enable covering index read optimization'
    ]
  },
  {
    id: 5,
    category: 'Cheatsheets',
    title: 'Modern React 19 & Redux Toolkit Architecture Sheet',
    author: 'Dev Education',
    description: 'Instant reference for async thunks, store memoization, createSlice lifecycle, custom hooks patterns, and render optimizations.',
    tags: ['React', 'Redux', 'Frontend'],
    readTime: '4 min read',
    codeSnippet: `// Standard Async Slice Pattern
export const fetchResource = createAsyncThunk('res/fetch', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(\`/items/\${id}\`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});`,
    keyPoints: [
      'Redux Toolkit uses Immer internally: direct mutations in reducers are safe',
      'useMemo / useCallback only needed for reference equality or heavy computes',
      'Keep server cache synchronized with thunk unwrap or React Query'
    ]
  }
];

const StudyMaterials = () => {
  const [activeCategory, setActiveCategory] = useState('All Materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [savedNotes, setSavedNotes] = useState({});

  const filteredMaterials = STUDY_MATERIALS.filter((mat) => {
    const matchesCategory = activeCategory === 'All Materials' || mat.category === activeCategory;
    const matchesSearch = mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mat.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSave = (id) => {
    setSavedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="page-theme-study" style={{ minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Hub Header */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '28px', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={24} color="#10b981" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Study Materials & Academic Notes
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Curated lecture notes, algorithm blueprints, math proofs, and engineering cheatsheets.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginTop: '18px' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search concepts, algorithms, formulas, or programming topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '46px', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Materials List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {filteredMaterials.map((mat) => (
            <div key={mat.id} className="glass-card glass-card-interactive" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(79, 172, 254, 0.12)', color: 'var(--accent-cyan)', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                      {mat.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>• {mat.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                    {mat.title}
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 12px 0' }}>
                    By {mat.author}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleToggleSave(mat.id)}
                    className="btn-secondary"
                    style={{ padding: '8px', borderRadius: '50%' }}
                    title={savedNotes[mat.id] ? "Saved" : "Save for study session"}
                  >
                    <Bookmark size={16} fill={savedNotes[mat.id] ? "var(--accent-amber)" : "none"} color={savedNotes[mat.id] ? "var(--accent-amber)" : "var(--text-dim)"} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                {mat.description}
              </p>

              {/* Code / Formula Snippet Box */}
              {mat.codeSnippet && (
                <div style={{
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Code2 size={14} /> EXCERPT / FORMULA
                    </span>
                    <button
                      onClick={() => handleCopyCode(mat.id, mat.codeSnippet)}
                      style={{ background: 'none', border: 'none', color: copiedId === mat.id ? '#34d399' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedId === mat.id ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === mat.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.84rem', color: 'var(--code-text)', overflowX: 'auto', lineHeight: '1.5' }}>
                    <code>{mat.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  Core Principles & Exam Takeaways:
                </span>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {mat.keyPoints.map((pt, idx) => (
                    <li key={idx} style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags and Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {mat.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => alert(`Full study PDF for "${mat.title}" will be generated for your session.`)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Download size={14} /> Download Notes PDF
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudyMaterials;
