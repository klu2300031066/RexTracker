import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children, className }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // Prevents scrolling while dragging on touch devices
        height: '100%', // Ensure it takes full height of grid cell
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={className}>
            {children}
        </div>
    );
};

export default SortableItem;
