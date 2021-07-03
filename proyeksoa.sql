-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2021 at 05:56 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

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
CREATE DATABASE IF NOT EXISTS `proyeksoa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `proyeksoa`;

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite` (
  `id_fav` int(11) NOT NULL,
  `username_user` varchar(100) NOT NULL,
  `id_team` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`id_fav`, `username_user`, `id_team`, `status`) VALUES
(1, 'hope', '5fda5faf06aa325e', 1),
(3, 'hope', '5fda5faf0c077d86', 0);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
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
(6, 6, '4-6-2021', '4-7-2021', '4-6-2021', '-');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
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
(4, 6, '4-6-2021', 100000, 'Bayar Tagihan Bulanan'),
(5, 6, '4-6-2021', 100000, 'Bayar Subcribe member menjadi Membership Kembali');

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

DROP TABLE IF EXISTS `stadium`;
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

DROP TABLE IF EXISTS `team`;
CREATE TABLE `team` (
  `id_team` varchar(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `country` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id_team`, `nama`, `country`, `status`) VALUES
('5fda5faf06aa325e', 'ES Paulhan Pezenas', 'FR', 0),
('5fda5faf088f5c1d', 'Ashburton Women', 'null', 0),
('5fda5faf095f63a2', 'Casa de Portugal', 'MO', 0),
('5fda5faf0a0beefd', 'Cigand SE', 'HU', 0),
('5fda5faf0a85b878', 'Malta Women U19', 'MT', 0),
('5fda5faf0b0134d5', 'Mar Menor', 'ES', 0),
('5fda5faf0c077d86', 'Lancing', 'GB', 0),
('5fda5faf0d252f9b', 'Deportivo Masaya', 'NI', 0),
('5fda5faf0e0e9765', 'Sporting Recco', 'IT', 0),
('5fda5faf0f641017', 'FK Borac', 'RS', 0),
('5fda5faf10423f22', 'Støvring', 'null', 0),
('5fda5faf10bc0aa5', 'Thammasat University', 'TH', 0),
('5fda5faf11aa8065', 'AS Salmamy', 'null', 0),
('5fda5faf127b3666', 'Rosh Haayin Beach', 'null', 0),
('5fda5faf13642102', 'UP Fighting Maroons', 'PH', 0),
('5fda5faf141e5f33', 'TSV Buchholz 08', 'DE', 0),
('5fda5faf1569d4b8', 'Holy Cross SC', 'IN', 0),
('5fda5faf16ec2c46', 'Ecuador Beach', 'EC', 0),
('5fda5faf180c9092', 'Viking FK U19', 'NO', 0),
('5fda5faf1937a52e', 'Linköpings Women', 'SE', 0),
('5fda5faf1a5a23e7', 'Djibouti U20', 'null', 0),
('5fda5faf1ba465c5', 'FC Germania 09 e.V. Niederrodenbach', 'null', 0),
('5fda5faf1d1f04cd', 'Fortuna Dusseldorf U19', 'DE', 0),
('5fda5faf1df9ab5f', 'Olimp Khotkovo', 'RU', 0),
('5fda5faf1e87f4ef', 'DJK Appeldorn', 'null', 0),
('5fda5faf1f8e4825', 'Maccabi Haifa U19', 'IL', 0),
('5fda5faf20b40e01', 'Super Power Samut Prakan U19', 'null', 0),
('5fda5faf218d6ff4', 'Waterford United U19', 'IE', 0),
('5fda5faf228fbe63', 'Maoming Oil FC', 'CN', 0),
('5fda5faf23762585', 'FC Trollhattan', 'SE', 0),
('5fda5faf24d108b7', 'Pelopas Kiatou', 'GR', 0),
('5fda5faf2604765e', 'KF Vllaznia Pozheran', 'null', 0),
('5fda5faf26aa8638', 'Malatya Yesilyurt Belediyespor', 'TR', 0),
('5fda5faf27174111', 'Societe Omnisports De L\'Armee', 'CI', 0),
('5fda5faf286ca5a2', 'Norway U17', 'NO', 0),
('5fda5faf290f3286', 'Igdir Es Spor', 'TR', 0),
('5fda5faf29c651ee', 'Kamphaeng Phet U19', 'null', 0),
('5fda5faf2a9f5452', 'Pacos Ferreira U19', 'PT', 0),
('5fda5faf2b728559', 'Al Raed', 'SA', 0),
('5fda5faf2c2bae88', 'Itapirense U20', 'BR', 0),
('5fda5faf2d523c9c', 'SU Tillmitsch', 'AT', 0),
('5fda5faf2df443f5', 'Knox City', 'AU', 0),
('5fda5faf2e90d591', 'FC India MFC', 'null', 0),
('5fda5faf2fdd43c9', 'Nika Ivano-Frankivsk U19', 'UA', 0),
('5fda5faf31305b8b', 'Midland Odessa Sockers', 'US', 0),
('5fda5faf323ed1fd', 'FC Minsk Reserves', 'BY', 0),
('5fda5faf32caaa81', 'RB Brasil U19', 'null', 0),
('5fda5faf33d50899', 'Norway Women U23', 'NO', 0),
('5fda5faf34f0f2c3', 'FC Bytkiv', 'UA', 0),
('5fda5faf3624bd69', 'NBP Rainbow', 'null', 0),
('5fda5faf36c643f9', 'Napredak Medosevac', 'RS', 0),
('5fda5faf384c2875', 'Colombia U17 Women', 'CO', 0),
('5fda5faf39ab5d42', 'Eibar', 'ES', 0),
('5fda5faf3aff5196', 'Al Dhaid U19', 'AE', 0),
('5fda5faf3bc7d742', 'Quartz FC', 'null', 0),
('5fda5faf3cddf251', 'CA Argentino de San Carlos', 'AR', 0),
('5fda5faf3df3b069', 'Urena FC', 'VE', 0),
('5fda5faf3f0d84a9', 'JK Viljandi', 'null', 0),
('5fda5faf40244193', 'KFC Duffel', 'BE', 0),
('5fda5faf4118ddac', 'Bustillos Women', 'BO', 0),
('5fda5faf41908182', 'KS Cyklon Rogoznik', 'null', 0),
('5fda5faf425390ef', 'Whitley Bay', 'GB', 0),
('5fda5faf4315e835', 'Servette FC Chenois Women', 'CH', 0),
('5fda5faf441815c9', 'Barcelona EC Women', 'null', 0),
('5fda5faf44a934d6', 'Stourport Swifts', 'GB', 0),
('5fda5faf45f97635', 'Pakhtakor-79', 'UZ', 0),
('5fda5faf46c00acd', 'Verdal U19', 'NO', 0),
('5fda5faf4800fe0a', 'Saint Louisienne', 'null', 0),
('5fda5faf48d91f78', 'Shikoku Gakuin University', 'null', 0),
('5fda5faf4a5b492d', 'AC Oulu U20', 'FI', 0),
('5fda5faf4b0bf3d0', 'FC Aral Nukus', 'null', 0),
('5fda5faf4bc474be', 'The Gap BPL Women', 'AU', 0),
('5fda5faf4cb804fe', 'AS Lattes', 'FR', 0),
('5fda5faf4da1c420', 'Al-Jehad', 'SY', 0),
('5fda5faf4e6bcec7', 'Iraq U20', 'IQ', 0),
('5fda5faf4f98feba', 'CFS Cartel Beach', 'null', 0),
('5fda5faf503791de', 'Aetos Koridallou', 'GR', 0),
('5fda5faf50d83e89', 'Sgs Essen-Schonebeck 19/68', 'null', 0),
('5fda5faf516191b2', 'Vrango IF', 'null', 0),
('5fda5faf52bcb53b', 'Graffin Vlasim', 'CZ', 0),
('5fda5faf53fc422b', 'CA Tigre Reserves', 'AR', 0),
('5fda5faf5511c3e6', 'CS Flacara Parta', 'null', 0),
('5fda5faf560312d9', 'Canelas 2010', 'null', 0),
('5fda5faf569b8704', 'Al Wihdat', 'JO', 0),
('5fda5faf57b60236', 'FC Ingolstadt', 'DE', 0),
('5fda5faf592503ec', 'Grenoble Foot 38 Women U19', 'null', 0),
('5fda5faf5a186f1b', 'Cartagines U20', 'null', 0),
('5fda5faf5b3dbc04', 'Esteghlal Molasani', 'IR', 0),
('5fda5faf5c830c96', 'Balga SC', 'AU', 0),
('5fda5faf5d340994', 'Greystones', 'IE', 0),
('5fda5faf5e7bf293', 'Russia U19', 'RU', 0),
('5fda5faf5f4fb564', '52 Orduspor FK', 'TR', 0),
('5fda5faf60368684', 'America FC TO U20', 'null', 0),
('5fda5faf613f1da3', 'BSG Stahl Riesa', 'null', 0),
('5fda5faf6216fe2d', 'Åsane Fotball Women', 'null', 0),
('5fda5faf63540c7b', 'Parnahyba U20', 'BR', 0),
('5fda5faf646b9a3a', 'Monmouth Town', 'GB', 0),
('5fda5faf65404fc3', 'Liverpool Montevideo', 'UY', 0),
('5fda5faf662cb3fb', 'FK Gorodeya', 'BY', 0),
('5fda5faf675d1a7a', 'NUI Maynooth', 'null', 0),
('Q0bAuLTe7Lcpmh19', 'manchester', 'EN', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
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
(6, '081350991277', 'bare', 'ansel', 'ansel@gmail.com', 2, '123', 0, './public/uploads/bare.jpg', '4p7La53Rm5jE3jIq3nBq');

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
  MODIFY `id_fav` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id_member` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id_payment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
