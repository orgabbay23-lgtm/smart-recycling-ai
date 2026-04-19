export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About the Project</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          Smart Recycling and Food Waste Prevention System
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This application leverages artificial intelligence to help users properly sort their recycling and identify the freshness of their food. By utilizing computer vision, we aim to reduce improper recycling and minimize food waste in households and businesses.
        </p>
        
        <h3 className="text-lg font-medium text-gray-800 mb-3">Powered by Deep Learning</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Under the hood, the system uses custom PyTorch ResNet18 models trained specifically for these tasks. Our models have achieved impressive real-world performance:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="text-emerald-600 text-sm font-medium mb-1">Waste Classification</div>
            <div className="text-3xl font-bold text-emerald-700">92%</div>
            <div className="text-emerald-600/80 text-sm mt-1">Accuracy</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-blue-600 text-sm font-medium mb-1">Freshness Detection</div>
            <div className="text-3xl font-bold text-blue-700">98%</div>
            <div className="text-blue-600/80 text-sm mt-1">Accuracy</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Created By</h3>
          <p className="text-gray-800 font-medium">Or Gabbay &amp; Daniel Yerichman</p>
        </div>
      </div>
    </div>
  )
}
