import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function TentLayoutTool() {
  const [elements, setElements] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const canvasRef = useRef(null);

  const addElement = (type) => {
    const newElement = {
      id: elements.length + 1,
      type,
      x: Math.floor(Math.random() * 800 / 20) * 20,
      y: Math.floor(Math.random() * 400 / 20) * 20,
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  const randomizeLayout = () => {
    const types = ["chair", "kubo", "tv"];
    const newElements = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.floor(Math.random() * 800 / 20) * 20,
      y: Math.floor(Math.random() * 400 / 20) * 20,
      rotation: Math.floor(Math.random() * 360),
    }));
    setElements(newElements);
  };

  const presetTheater = () => {
    const newElements = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 5; col++) {
        newElements.push({
          id: row * 5 + col,
          type: "chair",
          x: 100 + col * 100,
          y: 50 + row * 30,
          rotation: 0,
        });
      }
    }
    setElements(newElements);
  };

  const presetUShape = () => {
    const newElements = [];
    for (let i = 0; i < 8; i++) {
      newElements.push({ id: i, type: "chair", x: 100, y: 50 + i * 40, rotation: 0 });
      newElements.push({ id: i + 8, type: "chair", x: 600, y: 50 + i * 40, rotation: 0 });
    }
    for (let i = 0; i < 8; i++) {
      newElements.push({ id: i + 16, type: "chair", x: 150 + i * 50, y: 350, rotation: 0 });
    }
    setElements(newElements);
  };

  const presetLounge = () => {
    const newElements = [];
    for (let i = 0; i < 6; i++) {
      newElements.push({ id: i, type: "kubo", x: 150 + i * 100, y: 150, rotation: 0 });
      newElements.push({ id: i + 6, type: "chair", x: 130 + i * 100, y: 100, rotation: 0 });
      newElements.push({ id: i + 12, type: "chair", x: 170 + i * 100, y: 200, rotation: 0 });
    }
    setElements(newElements);
  };

  const exportAsImage = async () => {
    const canvas = await html2canvas(document.getElementById("tent-canvas"));
    const link = document.createElement("a");
    link.download = "tent-layout.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = "tent-layout.json";
    link.click();
  };

  const importFromJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedElements = JSON.parse(event.target.result);
      setElements(importedElements);
    };
    reader.readAsText(file);
  };

  const startDrag = (id) => (e) => {
    setDragging({ id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - dragging.offsetX) / 20) * 20;
    const y = Math.floor((e.clientY - rect.top - dragging.offsetY) / 20) * 20;
    setElements((prev) =>
      prev.map((el) => (el.id === dragging.id ? { ...el, x, y } : el))
    );
  };

  const endDrag = () => setDragging(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-orange-100 min-h-screen">
      <h1 className="text-2xl font-bold text-orange-700">Tent Opstelling Tool</h1>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => addElement("chair")}>Voeg stoel toe</button>
        <button onClick={() => addElement("kubo")}>Voeg Kubo toe</button>
        <button onClick={() => addElement("tv")}>Voeg TV toe</button>
        <button onClick={randomizeLayout}>Random opstelling</button>
        <button onClick={presetTheater}>Preset Theater</button>
        <button onClick={presetUShape}>Preset U-vorm</button>
        <button onClick={presetLounge}>Preset Lounge</button>
        <button onClick={exportAsImage}>Exporteer als afbeelding</button>
        <button onClick={exportAsJSON}>Sla op als JSON</button>
        <label className="cursor-pointer bg-orange-500 text-white px-3 py-2 rounded">
          Laad JSON
          <input type="file" accept=".json" onChange={importFromJSON} className="hidden" />
        </label>
        <button onClick={() => setShowHelp(!showHelp)}>Help</button>
      </div>

      {showHelp && (
        <div className="bg-white text-orange-700 border border-orange-400 rounded p-4 max-w-xl text-sm">
          <h2 className="font-bold mb-2">📘 Handleiding:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Klik op \"Voeg stoel/Kubo/TV toe\" om elementen te plaatsen.</li>
            <li><strong>Sleep</strong> elementen om ze te verplaatsen.</li>
            <li><strong>Dubbelklik</strong> op een element om het te draaien (45°).</li>
            <li>Klik op \"Exporteer als afbeelding\" om een PNG te downloaden.</li>
            <li>Met \"Sla op als JSON\" bewaar je je opstelling (later opnieuw te laden).</li>
            <li>Gebruik \"Laad JSON\" om een eerdere opstelling terug te openen.</li>
            <li>Kies een preset voor snelle opstellingen (Theater, U-vorm, Lounge).</li>
          </ul>
        </div>
      )}

      <div
        ref={canvasRef}
        id="tent-canvas"
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        className="relative w-[800px] h-[400px] bg-orange-200 border-4 border-orange-500 mt-4 overflow-hidden"
      >
        <div className="absolute inset-0 border-4 border-orange-600" />
        {elements.map((el) => (
          <div
            key={el.id}
            className={`absolute w-6 h-6 flex items-center justify-center rounded-full text-xs text-white cursor-move transform hover:scale-110 transition
              ${el.type === "chair" ? "bg-orange-500" : ""}
              ${el.type === "kubo" ? "bg-orange-700" : ""}
              ${el.type === "tv" ? "bg-black" : ""}
            `}
            style={{
              left: el.x,
              top: el.y,
              transform: `rotate(${el.rotation}deg)`
            }}
            onMouseDown={startDrag(el.id)}
            onDoubleClick={() => {
              setElements(elements.map(e => e.id === el.id ? { ...e, rotation: (e.rotation + 45) % 360 } : e));
            }}
            title="Dubbelklik om te roteren, sleep om te verplaatsen"
          >
            {el.type[0].toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
