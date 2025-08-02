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
import { apiRequest, API_ENDPOINTS } from '../src/config/api';
import './css/calender.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper functions for event types
const getEventIcon = (category) => {
  const categoryLower = category?.toLowerCase() || '';
  
  if (categoryLower.includes('football') || categoryLower.includes('soccer')) return '⚽';
  if (categoryLower.includes('basketball')) return '🏀';
  if (categoryLower.includes('baseball')) return '⚾';
  if (categoryLower.includes('tennis')) return '🎾';
  if (categoryLower.includes('cricket')) return '🏏';
  if (categoryLower.includes('volleyball')) return '🏐';
  if (categoryLower.includes('rugby')) return '🏉';
  if (categoryLower.includes('hockey') || categoryLower.includes('ice hockey')) return '🏒';
  if (categoryLower.includes('golf')) return '⛳';
  if (categoryLower.includes('swimming') || categoryLower.includes('pool')) return '🏊';
  if (categoryLower.includes('badminton')) return '🏸';
  if (categoryLower.includes('boxing') || categoryLower.includes('mma')) return '🥊';
  if (categoryLower.includes('cycling') || categoryLower.includes('bike')) return '🚴';
  if (categoryLower.includes('running') || categoryLower.includes('marathon') || categoryLower.includes('athletics')) return '🏃';
  if (categoryLower.includes('wrestling')) return '🤼';
  if (categoryLower.includes('weight') || categoryLower.includes('lifting')) return '🏋️';
  if (categoryLower.includes('skiing') || categoryLower.includes('snowboard')) return '⛷️';
  if (categoryLower.includes('surfing')) return '🏄';
  if (categoryLower.includes('climbing') || categoryLower.includes('mountaineering')) return '🧗';
  if (categoryLower.includes('archery')) return '🏹';
  if (categoryLower.includes('fencing')) return '🤺';
  if (categoryLower.includes('sailing') || categoryLower.includes('boat')) return '⛵';
  if (categoryLower.includes('fishing')) return '🎣';
  if (categoryLower.includes('racing') || categoryLower.includes('car') || categoryLower.includes('motor')) return '🏎️';
  
  // Default sports icon
  return '🏆';
};

const getEventTypeClass = (category) => {
  const categoryLower = category?.toLowerCase() || '';
  
  if (categoryLower.includes('football') || categoryLower.includes('soccer')) return 'event-football';
  if (categoryLower.includes('basketball')) return 'event-basketball';
  if (categoryLower.includes('baseball')) return 'event-baseball';
  if (categoryLower.includes('tennis')) return 'event-tennis';
  if (categoryLower.includes('cricket')) return 'event-cricket';
  if (categoryLower.includes('volleyball')) return 'event-volleyball';
  if (categoryLower.includes('rugby')) return 'event-rugby';
  if (categoryLower.includes('hockey')) return 'event-hockey';
  if (categoryLower.includes('golf')) return 'event-golf';
  if (categoryLower.includes('swimming')) return 'event-swimming';
  if (categoryLower.includes('badminton')) return 'event-badminton';
  if (categoryLower.includes('boxing') || categoryLower.includes('mma')) return 'event-boxing';
  if (categoryLower.includes('cycling')) return 'event-cycling';
  if (categoryLower.includes('running') || categoryLower.includes('marathon') || categoryLower.includes('athletics')) return 'event-running';
  if (categoryLower.includes('wrestling')) return 'event-wrestling';
  if (categoryLower.includes('weight') || categoryLower.includes('lifting')) return 'event-weightlifting';
  if (categoryLower.includes('skiing') || categoryLower.includes('snowboard')) return 'event-skiing';
  if (categoryLower.includes('surfing')) return 'event-surfing';
  if (categoryLower.includes('climbing')) return 'event-climbing';
  if (categoryLower.includes('archery')) return 'event-archery';
  if (categoryLower.includes('fencing')) return 'event-fencing';
  if (categoryLower.includes('sailing')) return 'event-sailing';
  if (categoryLower.includes('fishing')) return 'event-fishing';
  if (categoryLower.includes('racing') || categoryLower.includes('car') || categoryLower.includes('motor')) return 'event-racing';
  
  // Default event class
  return 'event-default';
};

const Calendar = ({ onClick }) => {
  const today = new Date();
  const dayRefs = useRef([]);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🗓️ Fetching calendar events...');
        const data = await apiRequest(API_ENDPOINTS.EVENTS);
        console.log('📅 Events data received:', data);
        
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else if (data && data.data && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          console.warn('⚠️ Unexpected events data structure:', data);
          setEvents([]);
        }
        
        console.log('✅ Events loaded successfully');
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        setEvents([]);
      }
    };
    
    fetchEvents();
  }, []);

  const monthOptions = monthNames.map((name, index) => ({ name, value: index }));

  const renderCalendar = (weeks) => {
    return weeks.map((week, wi) => (
      <div className="week" key={`week-${wi}`}>
        {week.map(({ month, day }, di) => {
          const index = wi * 7 + di;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          // Check if this is a new month for month labels
          const isNewMonth = di === 0 && (wi === 0 || weeks[wi - 1]?.[6]?.month !== month);

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

    return weeks;
  }, [year]);


  const calendarView = useMemo(() => {
    if (viewMode === 'week' && selectedDate) {
      const selectedWeekIndex = Math.floor(selectedDate / 7);
      const weeksToShow = [generateCalendar[selectedWeekIndex]];
      return renderCalendar(weeksToShow);
    }
    return renderCalendar(generateCalendar);
  }, [viewMode, selectedDate, generateCalendar]);




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
    // Set selected date for week view
    const dayIndex = generateCalendar.findIndex(week => 
      week.some(d => d.day === day && d.month === month)
    );
    if (dayIndex !== -1) {
      setSelectedDate(dayIndex * 7);
    }
  };

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      weekDays.push({
        month: day.getMonth(),
        day: day.getDate(),
        fullDate: day
      });
    }
    return weekDays;
  };

  const renderWeekView = () => {
    const weekDays = getCurrentWeekDays();
    
    return (
      <div className="week" key="current-week">
        {weekDays.map(({ month, day, fullDate }, index) => {
          const isToday = fullDate.toDateString() === new Date().toDateString();
          const dateKey = `${fullDate.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter(
            e => new Date(e.date).toISOString().slice(0, 10) === dateKey
          );

          return (
            <div
              key={`week-${month}-${day}-${index}`}
              className={`day-cell ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(day, month)}
            >
              <span>{day}</span>
              <div className="week-month-label">{monthNames[month].slice(0, 3)}</div>
              
              {/* Event Tooltip */}
              {dayEvents.length > 0 && (
                <div className="event-dot-wrapper">
                  <div className={`event-dot ${getEventTypeClass(dayEvents[0].category)}`}>
                    {getEventIcon(dayEvents[0].category)}
                  </div>
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
    );
  };

  const renderMonthView = () => {
    return generateCalendar.map((week, wi) => (
      <div className="week" key={`week-${wi}`}>
        {week.map(({ month, day }, di) => {
          const index = wi * 7 + di;
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
          const isNewMonth = index === 0 || generateCalendar.flat()[index - 1]?.month !== month;

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
                  <div className={`event-dot ${getEventTypeClass(dayEvents[0].category)}`}>
                    {getEventIcon(dayEvents[0].category)}
                  </div>
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
  };

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
    <div className="calendar-page">
      {/* Hero Section - Result Page Style */}
      <div className="calendar-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <h1 className="hero-title">Sports Calendar</h1>
          <p className="hero-subtitle">Never miss a match - Stay updated with all upcoming sports events</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{events.length}</span>
            <span className="stat-label">Total Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{events.filter(e => new Date(e.date) >= today).length}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(events.map(e => e.category)).size}</span>
            <span className="stat-label">Sports</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        {/* Enhanced Header */}
        <div className="calendar-header">
          <div className="header-left">
            <div className="view-modes">
              <button 
                className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button 
                className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
            </div>
            <div className="month-year-selector">
              <select value={selectedMonth} onChange={handleMonthChange} className="month-select">
                {monthOptions.map(opt => (
                  <option style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }} key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
              <div className="year-nav">
                <button onClick={handlePrevYear} className="nav-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>
                <span className="year-display">{year}</span>
                <button onClick={handleNextYear} className="nav-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button onClick={handleTodayClick} className="today-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          <div className="day-labels">
            {daysOfWeek.map(day => (
              <div key={day} className="day-label">
                <span className="day-name">{day}</span>
              </div>
            ))}
          </div>
          <div className="calendar-body">
            {viewMode === 'week' ? renderWeekView() : renderMonthView()}
          </div>
        </div>

        {/* Event Summary Sidebar */}
        <div className="events-sidebar">
          <div className="sidebar-header">
            <h3>Upcoming Events</h3>
            <div className="events-count">{events.filter(e => new Date(e.date) >= today).length}</div>
          </div>
          <div className="events-list">
            {events
              .filter(e => new Date(e.date) >= today)
              .slice(0, 5)
              .map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-date">
                    <span className="event-day">{new Date(event.date).getDate()}</span>
                    <span className="event-month">{monthNames[new Date(event.date).getMonth()].slice(0, 3)}</span>
                  </div>
                  <div className="event-details">
                    <h4 className="event-title">{event.category}</h4>
                    <p className="event-time">{event.time}</p>
                    <p className="event-venue">{event.venue}</p>
                  </div>
                  <div className="event-type">
                    <span className="type-badge">{event.category}</span>
                  </div>
                </div>
              ))
            }
            {events.filter(e => new Date(e.date) >= today).length === 0 && (
              <div className="no-events">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                </svg>
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
