import React from 'react';

function EventsListItem({ event, onFlag, onDelete, onUndo, isPendingDelete, countdown }) {
  const commonStyles = { margin: '10px', padding: '5px', textAlign: 'center' };

  if (isPendingDelete) {
    return (
      <div key={event.id} style={{ ...commonStyles, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => onUndo(event.id)} style={{ marginRight: '10px' }}>Undo</button>
        <div style={{ backgroundColor: '#d9edf7', color: '#31708f', padding: '5px', borderRadius: '5px' }}>
          {countdown}s
        </div>
      </div>
    );
  }

  return (
    <div key={event.id} style={{ ...commonStyles, backgroundColor: event.flagged ? 'yellow' : 'transparent' }}>
      <p>{event.message}</p>
      <button onClick={() => onFlag(event.id)}>Flag</button>
      <button onClick={() => onDelete(event.id)}>Delete</button>
    </div>
  );
}

function EventsList({ events, onFlag, onDelete, onUndo, pendingDeletes }) {
  return (
    <div style={{ maxHeight: '500px', overflowY: 'auto', position: 'relative' }}>
      {events.map((event) => {
        const pendingDelete = pendingDeletes.find(pd => pd.id === event.id);
        return (
          <EventsListItem
            key={event.id}
            event={event}
            onFlag={onFlag}
            onDelete={onDelete}
            onUndo={onUndo}
            isPendingDelete={!!pendingDelete}
            countdown={pendingDelete?.countdown}
          />
        );
      })}
    </div>
  );
}

export default EventsList;
