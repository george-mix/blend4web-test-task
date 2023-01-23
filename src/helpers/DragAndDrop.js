export class DragAndDrop {
  static getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  static handleDrag(draggables, className) {
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add(className);
      });
      draggable.addEventListener("dragend", () => {
        draggable.classList.remove(className);
      });
    });
  }
}

export function handleDragOver(container, className) {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = DragAndDrop.getDragAfterElement(container, e.clientY);
    const draggable = container.querySelector(`.${className}`);
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
}
