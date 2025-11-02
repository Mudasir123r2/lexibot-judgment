import { useState } from "react";
import { FaBrain, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import api from "../../../api/http";

export default function OutcomePrediction() {
  const [formData, setFormData] = useState({
    caseDetails: "",
    legalContext: "",
    caseType: "Civil"
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caseDetails.trim()) {
      alert("Please enter case details");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/ai/predict", {
        caseDetails: formData.caseDetails,
        legalContext: formData.legalContext,
        caseType: formData.caseType
      });
      
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to predict outcome. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      caseDetails: "",
      legalContext: "",
      caseType: "Civil"
    });
    setPrediction(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Case Outcome Prediction</h2>
        <p className="text-slate-400 text-sm">Get AI-powered predictions based on case details and legal context</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Form */}
        <div className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 shadow-xl h-fit lg:h-full flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Enter Case Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Case Type
              </label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              >
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Case Details *
              </label>
              <textarea
                value={formData.caseDetails}
                onChange={(e) => setFormData({ ...formData, caseDetails: e.target.value })}
                placeholder="Describe your case details, including facts, circumstances, parties involved, and any relevant information..."
                rows="8"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Legal Context (Optional)
              </label>
              <textarea
                value={formData.legalContext}
                onChange={(e) => setFormData({ ...formData, legalContext: e.target.value })}
                placeholder="Provide any relevant legal context, precedents, statutes, or regulations that may apply to this case..."
                rows="6"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !formData.caseDetails.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FaBrain /> Predict Outcome
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-slate-100 font-semibold"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 shadow-xl h-fit lg:h-full flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Prediction Results</h3>
          <div className="flex-1 overflow-y-auto">

          {!prediction && !loading && (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <FaBrain className="text-6xl mx-auto mb-4 opacity-30" />
                <p>Enter case details and click "Predict Outcome" to get AI-powered predictions</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FiLoader className="text-4xl mx-auto mb-4 text-indigo-500 animate-spin" />
                <p className="text-slate-400">Analyzing your case...</p>
              </div>
            </div>
          )}

          {prediction && (
            <div className="space-y-4">
              {/* Predicted Outcome */}
              <div className="p-4 rounded-xl bg-neutral-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Predicted Outcome</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    prediction.predictedOutcome === "Favorable"
                      ? "bg-green-500/20 text-green-400"
                      : prediction.predictedOutcome === "Unfavorable"
                      ? "bg-rose-500/20 text-rose-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {prediction.predictedOutcome || "Neutral"}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Confidence</span>
                    <span className="text-sm font-semibold text-slate-300">{prediction.confidence || 0}%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (prediction.confidence || 0) >= 70 ? "bg-green-500" :
                        (prediction.confidence || 0) >= 40 ? "bg-yellow-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${prediction.confidence || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              {prediction.reasoning && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h4 className="font-semibold text-white mb-2">Reasoning</h4>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{prediction.reasoning}</p>
                </div>
              )}

              {/* Risk Factors */}
              {prediction.riskFactors && prediction.riskFactors.length > 0 && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <FaTimesCircle className="text-rose-400" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {prediction.riskFactors.map((risk, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-rose-400 mt-1">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <FaCheckCircle className="text-green-400" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Similar Cases */}
              {prediction.similarCases && prediction.similarCases.length > 0 && (
                <div className="p-4 rounded-xl bg-neutral-800/50">
                  <h4 className="font-semibold text-white mb-2">Similar Cases</h4>
                  <div className="space-y-2">
                    {prediction.similarCases.map((similar, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-slate-300 font-medium">{similar.caseNumber || `Case ${i + 1}`}</span>
                        <span className="text-slate-500 ml-2">({similar.similarity}% similar, Outcome: {similar.outcome})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              {prediction.note && (
                <div className="p-3 rounded-xl bg-yellow-900/20 border border-yellow-500/30">
                  <p className="text-xs text-yellow-300">{prediction.note}</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

