-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2021 at 07:09 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proyeksoa`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `id_fav` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `keterangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id_member` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `last_payment` varchar(25) NOT NULL,
  `end_date` varchar(25) NOT NULL,
  `member_since` varchar(25) NOT NULL,
  `unsubscribe` varchar(25) NOT NULL DEFAULT '-'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id_member`, `id_user`, `last_payment`, `end_date`, `member_since`, `unsubscribe`) VALUES
(4, 2, '19-5-2021', '19-6-2021', '19-5-2021', '-'),
(5, 5, '3-6-2021', '3-7-2021', '3-6-2021', '-');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id_payment` int(11) NOT NULL,
  `id_member` int(11) NOT NULL,
  `tanggal_payment` varchar(25) NOT NULL,
  `value` int(11) NOT NULL,
  `keterangan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id_payment`, `id_member`, `tanggal_payment`, `value`, `keterangan`) VALUES
(2, 4, '19-5-2021', 100000, 'Bayar tagihan'),
(3, 4, '19-5-2021', 100000, 'Subscribe sebagai member lagi');

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `id_stadium` varchar(250) NOT NULL,
  `nama` varchar(250) NOT NULL,
  `city` varchar(250) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `kapasitas` int(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stadium`
--

INSERT INTO `stadium` (`id_stadium`, `nama`, `city`, `country`, `kapasitas`, `status`) VALUES
('5fb969788aa64e3c', 'Doha Stadium', 'Sakhnin', 'IL', 8500, 1),
('5fb969788b1699e1', 'Gallagher Stadium', 'Maidstone', 'GB', 2363, 1),
('5fb969788b3d7ac7', 'Prince Moulay Abdellah Stadium', 'Rabat', 'MA', 52000, 1),
('5fb969788b78261a', 'The Giant Hospitality Stadium', 'Llandudno', 'GB', 1503, 1),
('5fb969788b929a97', 'Yud-Alef Stadium', 'Ashdod', 'IL', 8200, 1),
('5fb969788ba6a2e3', 'King Fahd International Stadium', 'Riyadh', 'SA', 68752, 1),
('5fb969788bc0099b', 'Emirates Stadium', 'London', 'GB', 60272, 1),
('5fb969788bd5718b', 'Edgeley Park', 'Stockport', 'GB', 10832, 1),
('5fb969788becec9b', 'Liberty Way', 'Nuneaton', 'GB', 6250, 1),
('5fb969788c030eb1', 'Aggborough', 'Kidderminster', 'GB', 6238, 1),
('5fb969788c16e714', 'World of Smile Stadium', 'null', 'null', 0, 1),
('5fb969788c2c79cb', 'The Northolme', 'Gainsborough', 'GB', 4304, 1),
('5fb969788c3fd211', 'Broadhurst Park', 'Manchester', 'GB', 4400, 1),
('5fb969788c5d1b04', 'The Shay', 'Halifax', 'GB', 14061, 1),
('5fb969788c717b4d', 'The Chorley Group Victory Park Stadium', 'Chorley', 'GB', 4100, 1),
('5fb969788c858111', 'Horsfall Stadium', 'Bradford', 'GB', 0, 1),
('5fb969788c9884a3', 'Impact Arena', 'Alfreton', 'GB', 3600, 1),
('5fb969788cadf097', 'The Enclosed Ground', 'Whitehawk', 'GB', 2000, 1),
('5fb969788cc2623c', 'Woodspring Stadium', 'Weston-super-Mare', 'GB', 3500, 1),
('5fb969788cd7a027', 'Park View Road', 'null', 'null', 5500, 1),
('5fb969788cf0ffc4', 'Court Place Farm', 'Oxford', 'GB', 0, 1),
('5fb969788d0db763', 'York Road', 'Maidenhead', 'GB', 3000, 1),
('5fb969788d272edb', 'Bulpit Lane', 'Hungerford', 'GB', 2500, 1),
('5fb969788d40e066', 'Beveree Stadium', 'Hampton, London', 'GB', 3500, 1),
('5fb969788d58a71f', 'Stonebridge Road Stadium', 'Northfleet', 'GB', 5011, 1),
('5fb969788d6df9cf', 'Rookery Hill', 'Corringham, Essex', 'GB', 4000, 1),
('5fb969788d9faf3d', 'Stade Saniat Rmel', 'Tetouan', 'MA', 15000, 1),
('5fb969788dbd79a1', 'Stade Municipal', 'Kenitra', 'MA', 15000, 1),
('5fb969788dd8ddc5', 'Bootham Crescent', 'York', 'GB', 7872, 1),
('5fb969788e029525', 'Borough Sports Ground', 'null', 'null', 0, 1),
('5fb969788e26b774', 'Moss Rose', 'Macclesfield', 'GB', 6355, 1),
('5fb969788e4090fe', 'Haig Avenue', 'null', 'null', 0, 1),
('5fb969788e5d986b', 'Sincil Bank', 'Lincoln', 'GB', 10120, 1),
('5fb969788e7879a5', 'The New Lawn', 'Nailsworth', 'GB', 5147, 1),
('5fb969788ea17f10', 'Deva Stadium', 'null', 'null', 0, 1),
('5fb969788ed56b83', 'Vicarage Road', 'Watford', 'GB', 21400, 1),
('5fb969788ef345bc', 'Al-Hassan Stadium', 'Irbid', 'JO', 16000, 1),
('5fb969788f0e447a', 'CCM Kirumba Stadium', 'Mwanza', 'TZ', 35000, 1),
('5fb969788f305ebf', 'Karume Memorial Stadium', 'Dar es Salaam', 'TZ', 5000, 1),
('5fb969788fa99748', 'Kingfield Stadium', 'Woking-Foxhills', 'GB', 6036, 1),
('5fb96978902010a0', 'Spotless Stadium', 'null', 'null', 0, 1),
('5fb96978906860a9', 'Westpac Stadium', 'Wellington', 'NZ', 33500, 1),
('5fb969789083bbfd', 'Perry Park', 'Brisbane', 'AU', 5000, 1),
('5fb9697890a24220', 'Braga Municipal', 'Braga', 'PT', 30286, 1),
('5fb9697890b9541f', 'London Borough of Barking & Dagenham Stadium', 'null', 'null', 0, 1),
('5fb9697890d4b523', 'Teddy Stadium', 'Jerusalem', 'IL', 21600, 1),
('5fb9697890f03b2d', 'London Stadium', 'London', 'GB', 66000, 1),
('5fb9697891069028', 'Acre Municipal Stadium', 'null', 'null', 0, 1),
('5fb96978911dd836', 'Green Stadium', 'Nazareth', 'IL', 4000, 1),
('5fb96978913643fd', 'Afula Illit Stadium', 'Afula', 'IL', 14000, 1),
('5fb96978915b4795', 'Wheatsheaf Park', 'Staines', 'GB', 3009, 1),
('5fb96978916f7598', 'Imber Court', 'Molesey', 'GB', 3000, 1),
('5fb9697891854fb5', 'Moatside', 'Merstham', 'GB', 2000, 1),
('5fb96978919bc2e1', 'Victory Road', 'Leiston', 'GB', 2500, 1),
('5fb9697891b39313', 'West Leigh Park', 'Havant', 'GB', 5250, 1),
('5fb9697891d3137e', 'Earlsmead Stadium', 'South Harrow', 'GB', 3070, 1),
('5fb9697891f1e492', 'Champion Hill', 'Dulwich', 'GB', 3000, 1),
('5fb96978920f4829', 'New Lodge', 'Billericay', 'GB', 0, 1),
('5fb969789227d7a3', 'Bob Lucas Stadium', 'Weymouth', 'GB', 10000, 1),
('5fb9697892413480', 'The DCS Stadium', 'Stratford-upon-Avon', 'GB', 0, 1),
('5fb96978925b7fbf', 'Beaconsfield', 'null', 'null', 0, 1),
('5fb96978927c8896', 'Central Ground', 'Sutton Coldfield', 'GB', 2000, 1),
('5fb9697892b7c767', 'West Lancashire College Stadium', 'Skelmersdale', 'GB', 2500, 1),
('5fb9697892dce353', 'Dales Lane', 'Walsall', 'GB', 1400, 1),
('5fb96978930857c2', 'The Weaver Stadium', 'Nantwich', 'GB', 3500, 1),
('5fb96978932122a0', 'New Manor Ground', 'Ilkeston', 'GB', 3500, 1),
('5fb969789345694c', 'Keys Park', 'Hednesford', 'GB', 6500, 1),
('5fb9697893603612', 'Westfield Lane Stadium', 'South Elmsall', 'GB', 2087, 1),
('5fb9697893750d39', 'Penydarren Park', 'Merthyr Tydfil', 'GB', 10000, 1),
('5fb96978938e2404', 'Tatnam', 'Poole', 'GB', 2000, 1),
('5fb9697893a622ce', 'Tameside Stadium', 'Ashton-under-Lyne', 'GB', 4000, 1),
('5fb9697893c0e110', 'Adams Park', 'High Wycombe', 'GB', 9617, 1),
('5fb9697893d6a0e6', 'Fratton Park', 'Portsmouth', 'GB', 21100, 1),
('5fb9697893ecda52', 'Globe Arena', 'Morecambe', 'GB', 6476, 1),
('5fb96978940249a5', 'St James Park', 'Exeter', 'GB', 8830, 1),
('5fb969789417d386', 'Keepmoat Stadium', 'Doncaster', 'GB', 15231, 1),
('5fb9697894341801', 'Broadfield Stadium', 'Crawley', 'GB', 6134, 1),
('5fb969789456cb2e', 'Colchester Community Stadium', 'null', 'null', 0, 1),
('5fb969789470216f', 'Brunton Park', 'Carlisle', 'GB', 18202, 1),
('5fb96978948c3552', 'Abbey Stadium', 'Cambridge', 'GB', 8127, 1),
('5fb9697894a33ca1', 'Bloomfield Road', 'Blackpool', 'GB', 12555, 1),
('5fb9697894baf19c', 'The Hive Stadium', 'London', 'GB', 5634, 1),
('5fb9697894dabb50', 'The Crown Ground', 'Accrington', 'GB', 5057, 1),
('5fb969789508864d', 'County Ground', 'Swindon', 'GB', 15728, 1),
('5fb969789522bc4e', 'Greenhous Meadow', 'null', 'null', 0, 1),
('5fb96978953a6578', 'Glanford Park', 'Scunthorpe', 'GB', 9088, 1),
('5fb96978955348c7', 'SportsDirect.com Park', 'null', 'null', 0, 1),
('5fb96978956babc4', 'Sixfields Stadium', 'Northampton', 'GB', 7798, 1),
('5fb969789581dc3c', 'Priestfield Stadium', 'null', 'null', 0, 1),
('5fb96978959740ec', 'Ricoh Arena', 'Coventry', 'GB', 32500, 1),
('5fb9697895add3fe', 'Proact Stadium', 'Chesterfield', 'GB', 10504, 1),
('5fb9697895c2f33f', 'The Valley', 'London', 'GB', 27111, 1),
('5fb9697895dc86f5', 'Gigg Lane', 'Bury', 'GB', 11840, 1),
('5fb9697895fd2c43', 'DW Stadium', 'Wigan', 'GB', 25138, 1),
('5fb9697896120aef', 'Hillsborough Stadium', 'Sheffield', 'GB', 39812, 1),
('5fb96978962824bb', 'Loftus Road Stadium', 'null', 'null', 0, 1),
('5fb9697896406367', 'City Ground', 'Nottingham', 'GB', 30603, 1),
('5fb96978965419a7', 'Carrow Road', 'Norwich', 'GB', 27244, 1);

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id_team` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `tanggal_berdiri` varchar(25) NOT NULL,
  `logo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `no_telp` varchar(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(25) NOT NULL,
  `type` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `wallet` int(11) NOT NULL DEFAULT 0,
  `foto` varchar(255) NOT NULL,
  `api_key` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `no_telp`, `username`, `nama`, `email`, `type`, `password`, `wallet`, `foto`, `api_key`) VALUES
(2, '081350991278', 'hope', 'david', 'd4cornia@gmail.com', 2, '123', 100000, '', ''),
(3, '081350991277', 'bare', 'ansel', 'ansel@gmail.com', 1, '123', 0, './public/uploads/bare.jpg', 'aYxm0s4MW8K241B0m7I8'),
(4, '', 'admin', 'admin', '', 0, 'admin', 0, '', 'aYxm0s4MW8K241B0m7I5'),
(5, '081350991277', 'bare3', 'ansel', 'ansel3@gmail.com', 2, '123', 0, './public/uploads/bare3.png', 'zF183q9w93BhH27e09lt');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id_fav`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id_member`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id_payment`);

--
-- Indexes for table `stadium`
--
ALTER TABLE `stadium`
  ADD PRIMARY KEY (`id_stadium`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id_team`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id_fav` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id_member` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id_payment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id_team` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
