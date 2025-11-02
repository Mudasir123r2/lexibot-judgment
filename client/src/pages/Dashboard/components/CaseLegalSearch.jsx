import { useState } from "react";
import { FaSearch, FaGavel, FaCalendar, FaFileAlt } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import api from "../../../api/http";

export default function CaseLegalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("keywords"); // keywords, title, references
  const [caseType, setCaseType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJudgment, setSelectedJudgment] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim() && searchType !== "references") {
      alert("Please enter a search term");
      return;
    }

    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        ...(caseType && { caseType }),
        limit: 20
      };

      // If searching by title, modify the search query
      if (searchType === "title") {
        params.search = searchQuery;
      } else if (searchType === "references") {
        // Search by case number/reference
        params.search = searchQuery || "";
      }

      const { data } = await api.get("/judgments", { params });
      setResults(data.judgments || data || []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to search judgments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJudgmentDetails = async (id) => {
    try {
      const { data } = await api.get(`/judgments/${id}`);
      setSelectedJudgment(data);
    } catch (err) {
      console.error("Error fetching judgment details:", err);
      alert("Failed to load judgment details");
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Legal Case Search</h2>
        <p className="text-slate-400 text-sm">Find relevant legal cases by keywords, titles, or references</p>
      </div>

      {/* Search Options */}
      <div className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 mb-6 shadow-xl shrink-0">
        <div className="space-y-4">
          {/* Search Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search By</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSearchType("keywords")}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  searchType === "keywords"
                    ? "bg-indigo-600/30 border-indigo-500/50 text-white"
                    : "bg-neutral-800/50 border-white/10 text-slate-300 hover:bg-neutral-800/70"
                }`}
              >
                Keywords
              </button>
              <button
                onClick={() => setSearchType("title")}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  searchType === "title"
                    ? "bg-indigo-600/30 border-indigo-500/50 text-white"
                    : "bg-neutral-800/50 border-white/10 text-slate-300 hover:bg-neutral-800/70"
                }`}
              >
                Case Title
              </button>
              <button
                onClick={() => setSearchType("references")}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  searchType === "references"
                    ? "bg-indigo-600/30 border-indigo-500/50 text-white"
                    : "bg-neutral-800/50 border-white/10 text-slate-300 hover:bg-neutral-800/70"
                }`}
              >
                References
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {searchType === "keywords" && "Enter Keywords"}
              {searchType === "title" && "Enter Case Title"}
              {searchType === "references" && "Enter Case Number/Reference"}
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
                placeholder={
                  searchType === "keywords" ? "e.g., property dispute, contract breach..."
                  : searchType === "title" ? "e.g., Smith v. Johnson"
                  : "e.g., CIV-2024-001"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </div>
          </div>

          {/* Case Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Case Type (Optional)</label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value="">All Case Types</option>
              <option value="Civil">Civil</option>
              <option value="Criminal">Criminal</option>
              <option value="Family">Family</option>
              <option value="Corporate">Corporate</option>
              <option value="Property">Property</option>
              <option value="Contract">Contract</option>
              <option value="Employment">Employment</option>
              <option value="Intellectual Property">Intellectual Property</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Searching...
              </>
            ) : (
              <>
                <FaSearch /> Search Cases
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Found {results.length} {results.length === 1 ? "result" : "results"}
            </h3>
            {results.map((judgment) => (
              <div
                key={judgment._id}
                className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-5 hover:ring-white/20 hover:shadow-lg cursor-pointer transition-all animate-fade-in"
                onClick={() => fetchJudgmentDetails(judgment._id)}
              >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">{judgment.title}</h4>
                  <p className="text-sm text-slate-400">Case No: {judgment.caseNumber}</p>
                </div>
                {judgment.caseType && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400">
                    {judgment.caseType}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <FaGavel className="text-slate-500" />
                  <span>{judgment.court}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-slate-500" />
                  <span>{new Date(judgment.dateOfJudgment).toLocaleDateString()}</span>
                </div>
                {judgment.judge && (
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-slate-500" />
                    <span>Judge: {judgment.judge}</span>
                  </div>
                )}
              </div>
              {judgment.summary && (
                <p className="mt-3 text-sm text-slate-400 line-clamp-2">{judgment.summary}</p>
              )}
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-12 text-center text-slate-400">
            <FaSearch className="text-4xl mx-auto mb-4 opacity-30" />
            <p className="font-medium">No results found</p>
            <p className="text-sm mt-2">Try adjusting your search criteria or use different keywords.</p>
          </div>
        )}
      </div>

      {/* Judgment Detail Modal */}
      {selectedJudgment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl ring-1 ring-white/10 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedJudgment.title}</h2>
                <p className="text-slate-400">Case No: {selectedJudgment.caseNumber}</p>
              </div>
              <button
                onClick={() => setSelectedJudgment(null)}
                className="px-4 py-2 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-slate-100"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500">Court:</span> <span className="text-slate-300 ml-2">{selectedJudgment.court}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span> <span className="text-slate-300 ml-2">{new Date(selectedJudgment.dateOfJudgment).toLocaleDateString()}</span>
                </div>
                {selectedJudgment.judge && (
                  <div>
                    <span className="text-slate-500">Judge:</span> <span className="text-slate-300 ml-2">{selectedJudgment.judge}</span>
                  </div>
                )}
                {selectedJudgment.caseType && (
                  <div>
                    <span className="text-slate-500">Type:</span> <span className="text-slate-300 ml-2">{selectedJudgment.caseType}</span>
                  </div>
                )}
              </div>

              {selectedJudgment.summary && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h3 className="font-semibold text-white mb-2">Summary</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedJudgment.summary}</p>
                </div>
              )}

              {selectedJudgment.keyInformation && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h3 className="font-semibold text-white mb-3">Key Information</h3>
                  {selectedJudgment.keyInformation.parties && selectedJudgment.keyInformation.parties.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-slate-400 mb-1">Parties:</h4>
                      <ul className="list-disc list-inside text-slate-300">
                        {selectedJudgment.keyInformation.parties.map((party, i) => (
                          <li key={i}>{party.name} ({party.role})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedJudgment.keyInformation.issues && selectedJudgment.keyInformation.issues.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-slate-400 mb-1">Issues:</h4>
                      <ul className="list-disc list-inside text-slate-300">
                        {selectedJudgment.keyInformation.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

