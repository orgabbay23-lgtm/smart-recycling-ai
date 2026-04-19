import { useState, useEffect } from 'react'

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
    <div className="flex flex-col items-center gap-4">
      <label
        htmlFor="cameraInput"
        className="cursor-pointer inline-block rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors"
      >
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
        <img
          src={preview}
          alt="Selected preview"
          className="mt-4 max-w-xs rounded-lg shadow-md"
        />
      )}
    </div>
  )
}
