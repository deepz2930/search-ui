import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  X as XIcon,
  Settings as FilterIcon,
  Star as StarIcon,
  ChevronDown as ChevronDownIcon,
} from "lucide-react";



const DUMMY_RESULTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: [`Minimal UI Kit`, `SaaS Landing`, `Marketplace Dashboard`, `Onboarding Flow`][
    i % 4
  ],
  author: [`dpz`, `dp`, `deepz`, `deepika`][i % 4],
  tags: ["UI", "Design", "React", "Animation"].slice(0, (i % 4) + 1),
  excerpt:
    "Beautifully crafted component with micro-interactions and clean layout — perfect for modern dashboards.",
  rating: (Math.round((Math.random() * 4 + 1) * 10) / 10).toFixed(1),
  image: [
    "/images/ui.jpg",
    "/images/saas.jpg",
    "/images/dashboard.jpg",
    "/images/onboarding.jpg",
  ][i % 4],
}));

export default function SearchResultsAnimation() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [results, setResults] = useState(DUMMY_RESULTS);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("relevance");

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search simulation
  useEffect(() => {
    const id = setTimeout(() => {
      const q = query.trim().toLowerCase();
      let filtered = DUMMY_RESULTS.filter((r) => {
        if (!q) return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.tags.join(" ").toLowerCase().includes(q)
        );
      });

      if (selectedTags.length) {
        filtered = filtered.filter((r) =>
          selectedTags.every((t) => r.tags.includes(t))
        );
      }

      if (sort === "rating") {
        filtered = filtered.sort((a, b) => b.rating - a.rating);
      }

      setResults(filtered);
    }, 220);
    return () => clearTimeout(id);
  }, [query, selectedTags, sort]);

  const toggletag = (t) => {
    setSelectedTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  };

  const clear = () => {
    setQuery("");
    setSelectedTags([]);
    setSort("relevance");
    inputRef.current?.focus();
  };

  const tagsPool = useMemo(() => {
    const s = new Set();
    DUMMY_RESULTS.forEach((r) => r.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, []);

  // small keyboard accessibility: Esc to blur/close filters
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setFocused(false);
        setFiltersOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Search container */}
        <div className="relative">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-white shadow-lg rounded-2xl p-4 md:p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200">
                  <SearchIcon size={18} className="text-gray-500" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    className="flex-1 outline-none placeholder:text-gray-400 text-gray-800 bg-transparent"
                    placeholder="Search designs, authors, or tags"
                    aria-label="Search designs"
                  />

                  {query ? (
                    <button
                      onClick={clear}
                      className="p-1 rounded-full hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <XIcon size={16} className="text-gray-500" />
                    </button>
                  ) : null}
                </div>

                {/* Floating suggestions + animation that mimics the dribbble shot */}
                <AnimatePresence>
                  {focused && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 10 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="mt-2 bg-white border border-gray-100 shadow-md rounded-xl p-3 w-full"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-700">Recent searches</div>
                        <button
                          className="text-xs text-gray-500 hover:underline"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setQuery("")}
                        >
                          Clear
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Dashboard",
                          "Landing page",
                          "Auth flow",
                          "Onboarding",
                          "E-commerce",
                          "Profile card",
                        ].map((s) => (
                          <button
                            key={s}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setQuery(s);
                              inputRef.current?.focus();
                            }}
                            className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:shadow-sm"
                >
                  <FilterIcon size={16} />
                  <span className="text-sm">Filters</span>
                  <ChevronDownIcon size={16} />
                </button>


              </div>
            </div>

            {/* Filters panel */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-4 border-t pt-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      {tagsPool.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggletag(t)}
                          className={`px-3 py-1 rounded-full border text-sm ${selectedTags.includes(t)
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-white text-gray-700 border-gray-200"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-3 py-2 border rounded-xl text-sm"
                        aria-label="Sort results"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="rating">Top rated</option>
                      </select>

                      <div className="text-sm text-gray-500">{results.length} results</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results grid */}
          <div className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {results.map((r) => (
                  <motion.article
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 6, scale: 0.995 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.995 }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md"
                  >
                    <div className="relative h-40 rounded-md overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10" /> {/* overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white drop-shadow">
                            {r.title}
                          </div>
                          <button className="p-1 rounded-md bg-white/70 hover:bg-white">
                            <StarIcon size={16} className="text-gray-600" />
                          </button>
                        </div>
                        <div className="text-xs text-white/90 mt-1">by {r.author}</div>
                      </div>
                    </div>


                    <div className="mt-3 text-sm text-gray-600">{r.excerpt}</div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {r.tags.map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-full border border-gray-200">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="text-sm font-semibold text-gray-700">{r.rating} ★</div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Footer empty state when no results */}
            {results.length === 0 && (
              <div className="mt-8 text-center text-gray-500">No results — try different keywords or filters.</div>
            )}
          </div>
        </div>

        {/* subtle credits / hints */}
        <div className="mt-6 text-xs text-gray-400 text-center">Recreated UI/UX — hover cards, animated suggestions and filters.</div>
      </div>
    </div>
  );
}
