CREATE TABLE `reservation` (
  `reservation_id` int(20) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `guests` int(3) NOT NULL,
  `occasion` varchar(64) NOT NULL,
  `notes` varchar(512) NOT NULL,
  `table_id` int(11) NOT NULL
);


CREATE TABLE `reservation_config` (
  `start_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `buffer` int(11) NOT NULL
);


CREATE TABLE `reservation_tables` (
  `table_id` int(11) NOT NULL,
  `table_count` int(11) NOT NULL,
  `max_seats` int(11) NOT NULL,
  `min_seats` int(11) NOT NULL
);


CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `email` varchar(32) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0
);

ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservation_id`);

ALTER TABLE `reservation_config`
  ADD PRIMARY KEY (`start_time`);

ALTER TABLE `reservation_tables`
  ADD PRIMARY KEY (`table_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `reservation`
  MODIFY `reservation_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `reservation_tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `users`
MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `admin`) VALUES
('123@123.com', '$2a$10$/5SXooZdi2R77o.6UOlZR.EXk0RQrtsMsNjbv1xCjDOsiPxOHb3Ia', 'tester', 'Admin', 1);

COMMIT;