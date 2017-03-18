# home_payment
Rent payment tracking application

RESTful ROUTES

INDEX = {path: /index, Http verb: GET, Purpose: landing page}

NEW = {path: /overview/new, Http verb: GET, Purpose: Show new item form}

CREATE = {path: /overview, Http verb: POST, Purpose: create a new item, then redirect to overview}

SHOW = {path: /overview/:id, Http verb: GET, Purpose: Show info about one specific item/transaction}

EDIT = {path: /overview/:id/edit, Http verb: GET, Purpose: Show edit form for one item}

UPDATE = {path: /overview/:id, Http verb: PUT, Purpose: Update a particular item, then redirect to overview}

DESTROY = {path: /overview/:id, Http verb: DELETE, Purpose: delete a particular item, then redirect to overview}