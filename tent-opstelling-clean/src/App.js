import { useState, useRef } from "react";

export default function TentLayoutTool() {
  const [elements, setElements] = useState([]);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);

  const addElement = (type) => {
    const newElement = {
      id: elements.length + 1,
      type,
      x: 100,
      y: 100,
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  const startDrag = (id) => (e) => {
    setDragging({ id, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.offsetX;
    const y = e.clientY - rect.top - dragging.offsetY;
    setElements((prev) =>
      prev.map((el) => (el.id === dragging.id ? { ...el, x, y } : el))
    );
  };

  const endDrag = () => setDragging(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Tent Opstelling Tool (Veilig)</h1>
      <div className="flex gap-2">
        <button onClick={() => addElement('chair')} className="bg-blue-500 text-white p-2 rounded">Voeg stoel toe</button>
        <button onClick={() => addElement('kubo')} className="bg-green-500 text-white p-2 rounded">Voeg Kubo toe</button>
        <button onClick={() => addElement('tv')} className="bg-black text-white p-2 rounded">Voeg TV toe</button>
      </div>

      <div
        ref={canvasRef}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        id="tent-canvas"
        className="relative w-[800px] h-[400px] bg-white border-2 border-black mt-6"
      >
        {elements.map((el) => (
          <div
            key={el.id}
            className={\`absolute w-8 h-8 flex items-center justify-center rounded-full text-xs text-white cursor-move \${el.type === 'chair' ? 'bg-blue-500' : el.type === 'kubo' ? 'bg-green-500' : 'bg-black'}\`}
            style={{
              left: el.x,
              top: el.y,
            }}
            onMouseDown={startDrag(el.id)}
            title={\`Drag om te verplaatsen (\${el.type})\`}
          >
            {el.type[0].toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}