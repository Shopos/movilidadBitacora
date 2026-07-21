-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movilizacionesdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `viajes`
--

DROP TABLE IF EXISTS `viajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viajes` (
  `id_viaje` int NOT NULL AUTO_INCREMENT,
  `kms_inicial` int NOT NULL,
  `fecha_hora_inicio` datetime DEFAULT NULL,
  `lat_inicio` decimal(10,8) NOT NULL,
  `lng_inicio` decimal(11,8) NOT NULL,
  `fecha_hora_fin` datetime DEFAULT NULL,
  `lat_fin` decimal(10,8) DEFAULT NULL,
  `lng_fin` decimal(11,8) DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `motivo` text NOT NULL,
  `obs_viaje` text,
  `carga_combustible` tinyint(1) DEFAULT '0',
  `cantidad_carga` int DEFAULT NULL,
  `ultima_modificacion` datetime NOT NULL,
  `modificado_por` varchar(100) NOT NULL,
  `estado_viaje` enum('En espera','En proceso','Terminado') NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `patente` varchar(15) DEFAULT NULL,
  `lat_fin_real` decimal(10,8) DEFAULT NULL,
  `lng_fin_real` decimal(11,8) DEFAULT NULL,
  `nombre_funcionario` varchar(100) NOT NULL,
  `vehiculo` varchar(100) NOT NULL,
  `kms_fin` int NOT NULL,
  `modo` varchar(10) NOT NULL DEFAULT 'ida',
  `imagen_tablero_ida` varchar(150) DEFAULT NULL,
  `imagen_tablero_vuelta` varchar(150) DEFAULT NULL,
  `imagen_comprobante_ben` varchar(150) DEFAULT NULL,
  `hora_recomendada` datetime DEFAULT NULL,
  PRIMARY KEY (`id_viaje`),
  KEY `fk_usuario_viaje` (`id_usuario`),
  KEY `fk_vehiculo_viaje` (`patente`),
  CONSTRAINT `fk_usuario_viaje` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `fk_vehiculo_viaje` FOREIGN KEY (`patente`) REFERENCES `vehiculos` (`patente`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viajes`
--

LOCK TABLES `viajes` WRITE;
/*!40000 ALTER TABLE `viajes` DISABLE KEYS */;
INSERT INTO `viajes` VALUES (73,0,'2026-07-15 17:24:00',-34.63973900,-71.36591600,'2026-07-15 17:24:00',-34.68880391,-71.31401539,'Quinahue, Santa Cruz, Región del Libertador General Bernardo O\'Higgins, Chile','se inundo','...',0,0,'2026-07-15 17:24:00','Pepe Lopez','Terminado',29,'SSGW81',NULL,NULL,'Pepe Lopez','Mitsubishi Fuso',100,'ida','viajes/inicio/viajes_inicio_1784150672826.jpg','viajes/fin/viajes_fin_1784150699424.jpg',NULL,'2026-07-15 19:31:00'),(74,100,'2026-07-15 17:25:00',-34.68880391,-71.31401539,'2026-07-15 17:45:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde Quinahue, Santa Cruz, Región del Libertador General Bernardo O\'Higgins, Chile','.-.',1,10,'2026-07-15 17:45:00','Pepe Lopez','Terminado',29,'SSGW81',NULL,NULL,'Pepe Lopez','Mitsubishi Fuso',110,'vuelta','viajes/inicio/viajes_inicio_1784150732981.jpg','viajes/fin/viajes_fin_1784151946649.jpg','viajes/comprobante/viajes_comprobante_1784151946653.png',NULL),(76,0,'2026-07-17 11:35:00',-34.63973900,-71.36591600,'2026-07-17 11:37:00',-34.64390849,-71.36637211,'Ramón Sanfurgo, Villa La Vendimia, Los Boldos, Santa Cruz, Provincia de Colchagua,','test','as',0,0,'2026-07-17 11:37:00','Juan Pedro','Terminado',30,'SKYP73',NULL,NULL,'Juan Pedro','Mitsubishi Katana',0,'ida','viajes/inicio/viajes_inicio_1784302515406.png','viajes/fin/viajes_fin_1784302675526.jpg',NULL,'2026-07-17 12:33:00'),(78,0,'2026-07-17 11:38:00',-34.64390849,-71.36637211,'2026-07-17 11:38:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde Ramón Sanfurgo, Villa La Vendimia, Los Boldos, Santa Cruz, Provincia de Colchagua,','c',0,0,'2026-07-17 11:38:00','Juan Pedro','Terminado',30,'SKYP73',NULL,NULL,'Juan Pedro','Mitsubishi Katana',0,'vuelta','viajes/inicio/viajes_inicio_1784302695811.jpg','viajes/fin/viajes_fin_1784302706881.jpg',NULL,NULL),(79,0,'2026-07-20 15:40:00',-34.63973900,-71.36591600,'2026-07-20 15:40:00',-34.65274270,-71.19538190,'Nancagua, Provincia de Colchagua, Región del Libertador General Bernardo O\'Higgins, Chile','test auditoria','asafsfc',1,10,'2026-07-20 15:40:00','Pepe Lopez','Terminado',29,'JJVB95',NULL,NULL,'Pepe Lopez','Mercedes Benz Atego',0,'ida','viajes/inicio/viajes_inicio_1784576425089.jpg','viajes/fin/viajes_fin_1784576450353.jpg','viajes/comprobante/viajes_comprobante_1784576450355.png','2026-07-20 15:39:00'),(80,0,'2026-07-20 15:46:00',-34.65274270,-71.19538190,'2026-07-20 15:46:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde Nancagua, Provincia de Colchagua, Región del Libertador General Bernardo O\'Higgins, Chile','asdad',0,0,'2026-07-20 15:46:00','Pepe Lopez','Terminado',29,'JJVB95',NULL,NULL,'Pepe Lopez','Mercedes Benz Atego',0,'vuelta','viajes/inicio/viajes_inicio_1784576789884.jpg','viajes/fin/viajes_fin_1784576818677.png',NULL,NULL);
/*!40000 ALTER TABLE `viajes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-21 14:16:08
