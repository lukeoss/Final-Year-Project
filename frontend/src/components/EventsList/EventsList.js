// EventsList.js
import React from 'react';
import { Button } from 'react-bootstrap';

function EventsListItem({ event, onFlag, onDelete, onUndo, isPendingDelete, countdown }) {
  const commonStyles = { margin: '10px', padding: '5px', textAlign: 'center' };

  // console.log(event);
  if (isPendingDelete) {
    return (
      <div key={event.dbId} style={{ ...commonStyles, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button variant="primary" className="my-1" onClick={() => onUndo(event.dbId)} style={{ marginRight: '10px' }}>Undo</Button>
          <div style={{ backgroundColor: '#d9edf7', color: '#31708f', padding: '5px', borderRadius: '5px' }}>
            {countdown}s
          </div>
        </div>
        <hr className="solid" style={{ width: '100%' }} />
      </div>

    );
  }

  return (
    <div key={event.dbId} style={{ ...commonStyles, backgroundColor: event.flagged ? 'yellow' : 'transparent' }}>
      <p>{event.message}</p>
      <Button variant="primary" className="my-1" style={{ marginRight: '10px' }} onClick={() => onFlag(event.dbId)}>Flag</Button>
      <Button variant="primary" className="my-1" style={{ marginRight: '10px' }} onClick={() => onDelete(event.dbId)}>Delete</Button>
      <Button variant="primary" className="my-1" >Edit</Button>
      <hr className="solid"></hr>
    </div>
  );
}

function EventsList({ events, onFlag, onDelete, onUndo, pendingDeletes }) {
  return (
    <div style={{ maxHeight: '500px', overflowY: 'auto', position: 'relative' }}>
      {events.map((event) => {
        const pendingDelete = pendingDeletes.find(pd => pd.dbId === event.dbId);
        return (
          <EventsListItem
            key={event.dbId}
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
