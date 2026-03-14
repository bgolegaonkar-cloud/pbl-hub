package com.pbl.hub.controller;

import com.pbl.hub.model.Calendar;
import com.pbl.hub.repository.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CalendarController {

    @Autowired
    private CalendarRepository calendarRepository;

    @GetMapping
    public List<Calendar> getAllCalendarTasks() {
        return calendarRepository.findAll();
    }

    @PostMapping
    public Calendar createCalendarTask(@RequestBody Calendar calendar) {
        if (calendar.getLastUpdatedAt() == null || calendar.getLastUpdatedAt().equals("—")) {
            calendar.setLastUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        return calendarRepository.save(calendar);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Calendar> updateCalendarTask(@PathVariable Long id, @RequestBody Calendar calendarDetails) {
        return calendarRepository.findById(id).map(calendar -> {
            calendar.setTitle(calendarDetails.getTitle());
            calendar.setAssignee(calendarDetails.getAssignee());
            calendar.setStatus(calendarDetails.getStatus());
            calendar.setProgressPct(calendarDetails.getProgressPct());
            calendar.setStartDay(calendarDetails.getStartDay());
            calendar.setEndDay(calendarDetails.getEndDay());
            calendar.setMentorComment(calendarDetails.getMentorComment());

            if (calendarDetails.getLastUpdatedAt() != null) {
                calendar.setLastUpdatedAt(calendarDetails.getLastUpdatedAt());
            } else {
                calendar.setLastUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            }

            Calendar updatedCalendar = calendarRepository.save(calendar);
            return ResponseEntity.ok(updatedCalendar);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCalendarTask(@PathVariable Long id) {
        return calendarRepository.findById(id).map(calendar -> {
            calendarRepository.delete(calendar);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
