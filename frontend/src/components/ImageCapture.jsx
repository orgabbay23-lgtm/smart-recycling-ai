import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'

export default function ImageCapture({ image, onImageSelect }) {
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!image) {
      setPreview(null)
    }
  }, [image])

  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    onImageSelect(file)
    e.target.value = null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <label
        htmlFor="cameraInput"
        className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
      >
        <Camera className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        Take Picture or Upload
      </label>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        id="cameraInput"
        onChange={handleChange}
      />

      {preview && (
        <div className="mt-2 overflow-hidden rounded-2xl ring-1 ring-slate-200/80 shadow-lg animate-fade-in">
          <img
            src={preview}
            alt="Selected preview"
            className="max-h-72 max-w-xs object-contain"
          />
        </div>
      )}
    </div>
  )
}
