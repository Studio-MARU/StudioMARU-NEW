import { useState, type DragEvent } from 'react';

/**
 * Bild-Upload per Klick oder Drag & Drop.
 *
 * Das unsichtbare `<input type="file">` liegt über der ganzen Fläche —
 * so ist der gesamte Bereich klickbar, ohne einen eigenen Button.
 */
export default function FileDropzone({
  label,
  image,
  onDrop,
}: {
  label: string;
  /** Data-URL des bereits gewählten Bildes, sonst null */
  image: string | null;
  onDrop: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onDrop(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all h-32 ${
        isDragging
          ? 'border-black bg-black/5 dark:border-[#EBEBEB] dark:bg-white/10'
          : 'border-gray-300 bg-white/30 hover:bg-white/50 dark:border-white/20 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]'
      }`}
    >
      {image ? (
        <div className="relative w-full h-full">
          <img src={image} className="w-full h-full object-contain" alt="Preview" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <span className="text-white text-sm font-bold">Ändern</span>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-bold text-gray-700 dark:text-[#c9c9c9] mb-1">{label}</p>
          <p className="text-xs text-gray-500 dark:text-[#a3a3a3]">Klicken oder Ziehen</p>
        </>
      )}
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onDrop(file);
        }}
      />
    </div>
  );
}
