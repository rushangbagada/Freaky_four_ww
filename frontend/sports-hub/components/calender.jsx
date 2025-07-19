// // import React from 'react';
// // import './calender.css';

// // export default function Calendar() {
// //   return (
// //     <>
// //       <header className="calendar-header">
// //         <div className="container">
// //           <div className="header-content">
// //             <div className="icon">📅</div>
// //             <h1>Match Calendar</h1>
// //             <p>Stay updated with all upcoming matches and events</p>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="container">
// //         <section className="calendar-controls">
// //           <div className="month-nav">
// //             <h2>July 2025</h2>
// //             <div className="nav-buttons">
// //               <button className="btn">&lt;</button>
// //               <button className="btn">&gt;</button>
// //             </div>
// //           </div>

// //           <div className="sport-filter">
// //             <label htmlFor="sport">Filter:</label>
// //             <select id="sport">
// //               <option>All Sports</option>
// //               <option>Football</option>
// //               <option>Basketball</option>
// //               <option>Tennis</option>
// //             </select>
// //           </div>
// //         </section>

// //         <section className="calendar-grid">
// //           <div className="day-label">Sun</div>
// //           <div className="day-label">Mon</div>
// //           <div className="day-label">Tue</div>
// //           <div className="day-label">Wed</div>
// //           <div className="day-label">Thu</div>
// //           <div className="day-label">Fri</div>
// //           <div className="day-label">Sat</div>

// //           {/* Empty and filled calendar cells */}
// //           <div className="day-cell empty"></div>
// //           <div className="day-cell empty"></div>
// //           <div className="day-cell">1</div>
// //           <div className="day-cell">2</div>
// //           <div className="day-cell">3</div>
// //           <div className="day-cell">4</div>
// //           <div className="day-cell">5</div>
// //           {/* Add more day-cells as needed */}
// //         </section>

// //         <aside className="sidebar">
// //           <div className="events-box">
// //             <h3>Upcoming Events</h3>
// //             <ul className="event-list">
// //               <li>
// //                 <strong>Team A vs Team B</strong><br />
// //                 <span>2025-07-10 • 5:00 PM</span><br />
// //                 <small>Main Stadium</small>
// //               </li>
// //               {/* More events */}
// //             </ul>
// //           </div>

// //           <div className="legend-box">
// //             <h3>Sports Legend</h3>
// //             <ul className="legend-list">
// //               <li><span className="legend football"></span>Football</li>
// //               <li><span className="legend basketball"></span>Basketball</li>
// //               <li><span className="legend tennis"></span>Tennis</li>
// //             </ul>
// //           </div>
// //         </aside>
// //       </main>
// //     </>
// //   );
// // }

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import './calender.css';

// const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//                     'July', 'August', 'September', 'October', 'November', 'December'];

// const Calender = ({ onClick }) => {
//   const today = new Date();
//   const dayRefs = useRef([]);
//   const [year, setYear] = useState(today.getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(0);

//   const monthOptions = monthNames.map((month, index) => ({ name: month, value: `${index}` }));

//   const scrollToDay = (monthIndex, dayIndex) => {
//     const targetDayIndex = dayRefs.current.findIndex(
//       (ref) => ref?.getAttribute('data-month') === `${monthIndex}` &&
//                ref?.getAttribute('data-day') === `${dayIndex}`
//     );
//     const targetElement = dayRefs.current[targetDayIndex];
//     const container = document.querySelector('.calendar-container');

//     if (targetElement) {
//       const elementRect = targetElement.getBoundingClientRect();
//       const offset = elementRect.top - container.getBoundingClientRect().top - container.offsetHeight / 2 + elementRect.height / 2;
//       container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
//     }
//   };

//   const handlePrevYear = () => setYear(prev => prev - 1);
//   const handleNextYear = () => setYear(prev => prev + 1);
//   const handleMonthChange = (e) => {
//     const index = parseInt(e.target.value);
//     setSelectedMonth(index);
//     scrollToDay(index, 1);
//   };
//   const handleTodayClick = () => {
//     setYear(today.getFullYear());
//     scrollToDay(today.getMonth(), today.getDate());
//   };
//   const handleDayClick = (day, month) => {
//     if (onClick) onClick(day, month < 0 ? 11 : month, month < 0 ? year - 1 : year);
//   };

//   const generateCalendar = useMemo(() => {
//     const startDayOfWeek = new Date(year, 0, 1).getDay();
//     const daysInYear = [];

//     if (startDayOfWeek < 6) {
//       for (let i = 0; i < startDayOfWeek; i++) {
//         daysInYear.push({ month: -1, day: 32 - startDayOfWeek + i });
//       }
//     }

//     for (let month = 0; month < 12; month++) {
//       const totalDays = new Date(year, month + 1, 0).getDate();
//       for (let day = 1; day <= totalDays; day++) {
//         daysInYear.push({ month, day });
//       }
//     }

//     const extra = 7 - (daysInYear.length % 7);
//     if (extra < 7) {
//       for (let day = 1; day <= extra; day++) {
//         daysInYear.push({ month: 0, day });
//       }
//     }

//     const weeks = [];
//     for (let i = 0; i < daysInYear.length; i += 7) {
//       weeks.push(daysInYear.slice(i, i + 7));
//     }

//     return weeks.map((week, wi) => (
//       <div className="week" key={`week-${wi}`}>
//         {week.map(({ month, day }, di) => {
//           const index = wi * 7 + di;
//           const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
//           const isNewMonth = index === 0 || daysInYear[index - 1].month !== month;

//           return (
//             <div
//               key={`${month}-${day}`}
//               ref={(el) => dayRefs.current[index] = el}
//               data-month={month}
//               data-day={day}
//               className={`day-cell ${isToday ? 'today' : ''} ${month < 0 ? 'dimmed' : ''}`}
//               onClick={() => handleDayClick(day, month)}
//             >
//               <span>{day}</span>
//               {isNewMonth && <div className="month-label">{monthNames[month]}</div>}
//             </div>
//           );
//         })}
//       </div>
//     ));
//   }, [year]);

//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           const month = parseInt(entry.target.getAttribute('data-month'));
//           if (!isNaN(month)) setSelectedMonth(month);
//         }
//       });
//     }, {
//       root: document.querySelector('.calendar-container'),
//       rootMargin: '-75% 0px -25% 0px',
//       threshold: 0
//     });

//     dayRefs.current.forEach((ref) => {
//       if (ref?.getAttribute('data-day') === '15') observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [generateCalendar]);

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <select value={selectedMonth} onChange={handleMonthChange}>
//           {monthOptions.map(opt => (
//             <option key={opt.value} value={opt.value}>{opt.name}</option>
//           ))}
//         </select>
//         <button onClick={handleTodayClick}>Today</button>
//         <div className="year-nav">
//           <button onClick={handlePrevYear}>◀</button>
//           <span>{year}</span>
//           <button onClick={handleNextYear}>▶</button>
//         </div>
//       </div>
//       <div className="day-labels">
//         {daysOfWeek.map(day => <div key={day}>{day}</div>)}
//       </div>
//       <div className="calendar-body">{generateCalendar}</div>
//     </div>
//   );
// };

// export default Calender


import React, { useEffect, useMemo, useRef, useState } from 'react';
import './css/calender.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Calendar = ({ onClick }) => {
  const today = new Date();
  const dayRefs = useRef([]);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else if (Array.isArray(data.events)) setEvents(data.events);
      })
      .catch(err => console.log(err));
  }, []);

  const monthOptions = monthNames.map((name, index) => ({ name, value: index }));

  const scrollToDay = (monthIndex, dayIndex) => {
    const targetElement = dayRefs.current.find(
      (ref) =>
        parseInt(ref?.getAttribute('data-month')) === monthIndex &&
        parseInt(ref?.getAttribute('data-day')) === dayIndex
    );
    const container = document.querySelector('.calendar-container');
    if (targetElement && container) {
      const elementRect = targetElement.getBoundingClientRect();
      const offset =
        elementRect.top -
        container.getBoundingClientRect().top -
        container.offsetHeight / 2 +
        elementRect.height / 2;
      container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
    }
  };

  const handleTodayClick = () => {
    if (events.length > 0) {
      const earliest = events.reduce((min, e) =>
        new Date(e.date) < new Date(min.date) ? e : min
      );
      const d = new Date(earliest.date);
      setYear(d.getFullYear());
      setSelectedMonth(d.getMonth());
      setTimeout(() => {
        scrollToDay(d.getMonth(), d.getDate());
      }, 100);
    } else {
      setYear(today.getFullYear());
      setSelectedMonth(today.getMonth());
      setTimeout(() => {
        scrollToDay(today.getMonth(), today.getDate());
      }, 100);
    }
  };

  const handleMonthChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedMonth(index);
    scrollToDay(index, 1);
  };

  const handlePrevYear = () => setYear(prev => prev - 1);
  const handleNextYear = () => setYear(prev => prev + 1);

  const handleDayClick = (day, month) => {
    if (onClick) onClick(day, month < 0 ? 11 : month, month < 0 ? year - 1 : year);
  };

  const generateCalendar = useMemo(() => {
    const startDayOfWeek = new Date(year, 0, 1).getDay();
    const daysInYear = [];

    if (startDayOfWeek < 6) {
      for (let i = 0; i < startDayOfWeek; i++) {
        daysInYear.push({ month: -1, day: 32 - startDayOfWeek + i });
      }
    }

    for (let month = 0; month < 12; month++) {
      const totalDays = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= totalDays; day++) {
        daysInYear.push({ month, day });
      }
    }

    const extra = 7 - (daysInYear.length % 7);
    if (extra < 7) {
      for (let day = 1; day <= extra; day++) {
        daysInYear.push({ month: 0, day });
      }
    }

    const weeks = [];
    for (let i = 0; i < daysInYear.length; i += 7) {
      weeks.push(daysInYear.slice(i, i + 7));
    }

    return weeks.map((week, wi) => (
      <div className="week" key={`week-${wi}`}>
        {week.map(({ month, day }, di) => {
          const index = wi * 7 + di;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const isNewMonth = index === 0 || daysInYear[index - 1].month !== month;

          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter(
            e => new Date(e.date).toISOString().slice(0, 10) === dateKey
          );

          return (
            <div
              key={`${month}-${day}-${index}`}
              ref={(el) => (dayRefs.current[index] = el)}
              data-month={month}
              data-day={day}
              className={`day-cell ${isToday ? 'today' : ''} ${month < 0 ? 'dimmed' : ''}`}
              onClick={() => handleDayClick(day, month)}
            >
              <span>{day}</span>
              {isNewMonth && month >= 0 && (
                <div className="month-label">{monthNames[month]}</div>
              )}

              {/* Event Tooltip */}
              {dayEvents.length > 0 && (
                <div className="event-dot-wrapper">
                  <div className="event-dot">📍</div>
                  <div className="tooltip">
                    {dayEvents.map((event, i) => (
                      <div key={i}>
                        <strong>{event.category}</strong><br />
                        <small>{new Date(event.date).toISOString().slice(0, 10)} - {event.time}</small><br />
                        <small>{event.venue}</small>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, events]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const month = parseInt(entry.target.getAttribute('data-month'));
          if (!isNaN(month)) setSelectedMonth(month);
        }
      });
    }, {
      root: document.querySelector('.calendar-container'),
      rootMargin: '-75% 0px -25% 0px',
      threshold: 0
    });

    dayRefs.current.forEach((ref) => {
      if (ref?.getAttribute('data-day') === '15') observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [generateCalendar]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.name}</option>
          ))}
        </select>
        <button onClick={handleTodayClick}>Today</button>
        <div className="year-nav">
          <button onClick={handlePrevYear}>◀</button>
          <span>{year}</span>
          <button onClick={handleNextYear}>▶</button>
        </div>
      </div>

      <div className="day-labels">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="calendar-body">{generateCalendar}</div>
    </div>
  );
};

export default Calendar;
