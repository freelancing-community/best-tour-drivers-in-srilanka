# Brevo email templates

Paste these HTML files into Brevo transactional templates, then put the template IDs in `.env`.

## Files
- `tour-booking-confirmation.html` → `TOUR_BOOKING_CONFIRMATION_TEMPLATE_ID`
- `inquiry-notification.html` → `INQUIRY_NOTIFICATION_TEMPLATE_ID`
- `contact-us-notification.html` → `CONTACT_NOTIFICATION_TEMPLATE_ID`
- `tailor-mode-notification.html` → `TAILOR_MODE_NOTIFICATION_TEMPLATE_ID`

## Brevo subjects
- Booking: `New tour booking — {{ params.tour_title }}`
- Inquiry: `New tour inquiry — {{ params.tour_title }}`
- Contact: `New contact message — {{ params.guest_name }}`
- Tailor Mode: `New tailor-made tour request — {{ params.guest_name }}`

## Params mapping

### Booking (`tour-booking-confirmation.html`)
| Brevo param | Source |
|-------------|--------|
| `guest_name` | Form: guest name |
| `guest_phone` | Form: guest phone |
| `guest_email` | Form: guest email |
| `tour_title` | `tours.json` title |
| `tour_id` | Tour route id |
| `tour_date` | Form: selected date |
| `tour_time` | Form: preferred time (or `Not specified`) |
| `ticket_count` | Form: ticket count |
| `price_from` | `tours.json` price |

### Inquiry (`inquiry-notification.html`)
| Brevo param | Source |
|-------------|--------|
| `guest_name` | Form: name |
| `guest_phone` | Form: phone |
| `guest_email` | Form: email |
| `message` | Form: message |
| `tour_title` | `tours.json` title |
| `tour_id` | Tour route id |

### Contact Us (`contact-us-notification.html`)
| Brevo param | Source |
|-------------|--------|
| `guest_name` | Form: name |
| `guest_phone` | Form: WhatsApp number |
| `guest_email` | Form: email |
| `message` | Form: message |

### Tailor Mode (`tailor-mode-notification.html`)
| Brevo param | Source |
|-------------|--------|
| `guest_name` | first + last name |
| `guest_phone` | dial code + mobile |
| `guest_email` | email |
| `preferred_communication` | WhatsApp / Email |
| `country` | country |
| `travelers` | adults / children / infants |
| `arrival` | arrival date + time |
| `departure` | departure date + time |
| `currency` | currency |
| `arrange_accommodation` | Yes / No |
| `has_tour_plan` | Yes / No |
| `special_requests` | special requests |

All forms use the same API: `POST /api/notify` with `type`: `booking` | `inquiry` | `contact` | `tailor`.

Logo: `https://i.ibb.co/VphF6y0G/logo.png`
