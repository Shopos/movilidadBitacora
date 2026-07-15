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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viajes`
--

LOCK TABLES `viajes` WRITE;
/*!40000 ALTER TABLE `viajes` DISABLE KEYS */;
INSERT INTO `viajes` VALUES (27,10000,'2026-07-02 11:40:00',-34.63973900,-71.36591600,'2026-07-02 13:40:00',-34.39862081,-71.62073176,'test 6','test 6','test5',1,10,'2026-07-02 13:40:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',10020,'ida',NULL,NULL,NULL,NULL),(29,1000,'2026-07-02 14:50:00',-34.63973900,-71.36591600,'2026-07-02 15:50:00',-34.62642196,-71.35173798,'test  6','test 6','test 6',1,10,'2026-07-02 15:50:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1005,'ida',NULL,NULL,NULL,NULL),(30,5000,'2026-07-02 16:55:00',-34.63973900,-71.36591600,'2026-07-02 16:55:00',-34.65257160,-71.19166378,'test 7','test 7','test 7',0,0,'2026-07-02 16:55:00','usuario prueba','Terminado',8,'cvfg12',NULL,NULL,'usuario prueba','Nissan',5005,'ida',NULL,NULL,NULL,NULL),(31,5005,'2026-07-02 16:59:00',-34.65257160,-71.19166378,'2026-07-02 18:30:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde test 7','test 7 -fin',1,10,'2026-07-02 18:30:00','usuario prueba','Terminado',8,'cvfg12',NULL,NULL,'usuario prueba','Nissan',5010,'vuelta',NULL,NULL,NULL,NULL),(32,12300,'2026-07-02 16:30:00',-34.63973900,-71.36591600,'2026-07-02 16:41:00',-34.63624093,-71.35242462,'pepe','pepe','01',0,0,'2026-07-02 16:41:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12310,'ida',NULL,NULL,NULL,NULL),(33,1005,'2026-07-02 16:00:00',-34.63973900,-71.36591600,'2026-07-02 20:00:00',-34.66214566,-71.41902345,'prueba','prueba','nada',0,0,'2026-07-02 20:00:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1010,'ida',NULL,NULL,NULL,NULL),(34,1010,'2026-07-02 18:10:00',-34.66214566,-71.41902345,'2026-07-02 20:10:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde prueba','---',0,0,'2026-07-02 20:10:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1014,'vuelta',NULL,NULL,NULL,NULL),(35,12310,'2026-07-02 16:47:00',-34.63624093,-71.35242462,'2026-07-02 20:50:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde pepe','',0,0,'2026-07-02 20:50:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12312,'vuelta',NULL,NULL,NULL,NULL),(36,1014,'2026-07-31 19:00:00',-34.63973900,-71.36591600,'2026-07-02 22:00:00',-34.63670044,-71.36289362,'','dddd','xxx',0,0,'2026-07-02 22:00:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1020,'ida',NULL,NULL,NULL,NULL),(37,1020,'2026-07-09 13:05:00',-34.63670044,-71.36289362,'2026-07-03 14:09:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde ','',0,0,'2026-07-03 14:09:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1025,'vuelta',NULL,NULL,NULL,NULL),(38,12000,'2026-07-03 15:55:00',-34.63973900,-71.36591600,'2026-07-03 16:00:00',-34.63546330,-71.36547089,'testing','asd','cccc',0,0,'2026-07-03 16:00:00','usuario prueba','Terminado',8,'bc1245',NULL,NULL,'usuario prueba','Suzuki',12005,'ida',NULL,NULL,NULL,NULL),(39,12005,'2026-07-04 14:00:00',-34.63546330,-71.36547089,'2026-07-03 17:00:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde testing','fcf',1,3,'2026-07-03 17:00:00','usuario prueba','Terminado',8,'bc1245',NULL,NULL,'usuario prueba','Suzuki',12015,'vuelta',NULL,NULL,NULL,NULL),(40,1025,'2026-07-07 09:36:00',-34.63973900,-71.36591600,'2026-07-07 11:00:00',-34.62945060,-71.37036645,'edit 3','test edit 4','listo',0,0,'2026-07-07 11:00:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1026,'ida',NULL,NULL,NULL,NULL),(41,3300,'2026-07-06 20:36:00',-34.63973900,-71.36591600,'2026-07-07 17:14:00',-34.63910398,-71.38379574,'xpepex','pepe lope','ccc',0,0,'2026-07-07 17:14:00','Pepe Lopez','Terminado',9,'abbb2',NULL,NULL,'Pepe Lopez','Tesla',3301,'ida',NULL,NULL,NULL,NULL),(42,3301,'2026-07-08 11:09:00',-34.63910398,-71.38379574,'2026-07-07 11:09:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde xpepex','xxx',0,0,'2026-07-07 11:09:00','Pepe Lopez','Terminado',9,'abbb2',NULL,NULL,'Pepe Lopez','Tesla',3302,'vuelta',NULL,NULL,NULL,NULL),(43,1026,'2026-07-07 11:01:00',-34.62945060,-71.37036645,'2026-07-07 11:01:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde edit 3','listo 2',1,3,'2026-07-07 11:01:00','usuario prueba','Terminado',8,'abc123',NULL,NULL,'usuario prueba','Toyota',1027,'vuelta',NULL,NULL,NULL,NULL),(44,1027,'2026-07-07 11:23:00',-34.63973900,-71.36591600,'2026-07-07 11:25:00',-34.63481048,-71.36880219,'pepe2','pepepe','asd',0,0,'2026-07-07 11:25:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1027,'ida',NULL,NULL,NULL,NULL),(45,14000,'2026-07-09 11:02:00',-34.63973900,-71.36591600,'2026-07-09 13:11:00',-34.63340183,-71.36377566,'agendado test45','test45','',1,4,'2026-07-09 13:11:00','usuario prueba','Terminado',8,'dc1243',NULL,NULL,'usuario prueba','Maxus',14001,'ida','viajes/inicio/viajes_inicio_1783609325894.jpg','viajes/fin/viajes_fin_1783616851904.jpg','viajes/comprobante/viajes_comprobante_1783615615509.jpg',NULL),(46,1027,'2026-07-07 11:30:00',-34.63481048,-71.36880219,'2026-07-07 11:30:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde pepe2','terminado',0,0,'2026-07-07 11:30:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',1028,'vuelta',NULL,NULL,NULL,NULL),(47,14001,'2026-07-09 14:46:00',-34.63340183,-71.36377566,'2026-07-09 16:07:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde agendado test45','',1,5,'2026-07-09 16:07:00','usuario prueba','Terminado',8,'dc1243',NULL,NULL,'usuario prueba','Maxus',14002,'vuelta','viajes/inicio/viajes_inicio_1783622766810.jpg','viajes/fin/viajes_fin_1783627636761.png','viajes/comprobante/viajes_comprobante_1783627636765.jpg',NULL),(48,1028,'2026-07-09 17:04:00',-34.63973900,-71.36591600,'2026-07-09 17:06:00',-34.58369745,-70.98945525,'imagenes','test imagenes','',0,0,'2026-07-09 17:06:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',0,'ida','viajes/inicio/viajes_inicio_1783631069056.jpg','viajes/fin/viajes_fin_1783631205190.jpg',NULL,NULL),(49,0,'2026-07-09 17:09:00',-34.58369745,-70.98945525,'2026-07-09 17:13:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde imagenes','zxc',1,4,'2026-07-09 17:13:00','Pepe Lopez','Terminado',9,'abc123',NULL,NULL,'Pepe Lopez','Toyota',6,'vuelta','viajes/inicio/viajes_inicio_1783631348932.jpg','viajes/fin/viajes_fin_1783631622590.jpg','viajes/comprobante/viajes_comprobante_1783631622592.jpg',NULL),(50,12312,'2026-07-10 12:28:00',-34.63973900,-71.36591600,'2026-07-10 12:30:00',-34.77632992,-71.16353496,'pepe','pepepepe','nada relevante',1,25,'2026-07-10 12:30:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12320,'ida','viajes/inicio/viajes_inicio_1783700915821.jpg','viajes/fin/viajes_fin_1783701001960.jpg','viajes/comprobante/viajes_comprobante_1783701001963.png',NULL),(53,12320,'2026-07-13 15:42:00',-34.77632992,-71.16353496,'2026-07-13 15:42:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde pepe','nada',0,0,'2026-07-13 15:42:00','Pepe Lopez','Terminado',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',12321,'vuelta','viajes/inicio/viajes_inicio_1783971735763.jpg','viajes/fin/viajes_fin_1783971748990.png',NULL,NULL),(54,14002,'2026-07-13 10:58:00',-34.63973900,-71.36591600,'2026-07-13 10:59:00',-34.98536800,-71.23937050,'Curicó, Provincia de Curicó, Región del Maule, Chile','test123','',0,0,'2026-07-13 10:59:00','usuario prueba','Terminado',8,'dc1243',NULL,NULL,'usuario prueba','Maxus',14002,'ida','viajes/inicio/viajes_inicio_1783954702531.jpg','viajes/fin/viajes_fin_1783954754018.jpg',NULL,NULL),(55,6,NULL,-34.63973900,-71.36591600,NULL,-34.64397950,-71.36006355,'test 2','test *espera',NULL,0,NULL,'2026-07-13 10:16:00','Administrativo 1','En espera',8,'abc123',NULL,NULL,'usuario prueba','Toyota',0,'ida',NULL,NULL,NULL,NULL),(56,3302,NULL,-34.63973900,-71.36591600,NULL,-34.63051457,-71.37036324,'test','test *3 viaje',NULL,0,NULL,'2026-07-13 10:16:00','Administrativo 1','En espera',8,'abbb2',NULL,NULL,'usuario prueba','Tesla',0,'ida',NULL,NULL,NULL,NULL),(57,14002,NULL,-34.98536800,-71.23937050,NULL,-34.63973900,-71.36591600,'Municipalidad','Regreso desde Curicó, Provincia de Curicó, Región del Maule, Chile',NULL,0,NULL,'2026-07-13 10:59:00','usuario prueba','En espera',8,'dc1243',NULL,NULL,'usuario prueba','Maxus',0,'vuelta',NULL,NULL,NULL,NULL),(58,123000,'2026-07-14 11:32:00',-34.63973900,-71.36591600,'2026-07-14 11:32:00',-34.98536800,-71.23937050,'Curicó, Provincia de Curicó, Región del Maule, Chile','testing','asd',0,0,'2026-07-14 11:32:00','Pepe Lopez','Terminado',9,'123',NULL,NULL,'Pepe Lopez','qwe',123001,'ida','viajes/inicio/viajes_inicio_1784043149484.jpg','viajes/fin/viajes_fin_1784043168550.jpg',NULL,NULL),(68,12321,NULL,-34.63973900,-71.36591600,NULL,-34.63702142,-71.37122154,'pepe','',NULL,0,NULL,'2026-07-14 10:14:00','Administrativo 1','En espera',9,'12pepe',NULL,NULL,'Pepe Lopez','peeplopez',0,'ida',NULL,NULL,NULL,'2026-07-14 11:15:00'),(69,2100,NULL,-34.63973900,-71.36591600,NULL,-34.63345509,-71.35487080,'deptpo','',NULL,0,NULL,'2026-07-14 09:20:00','Administrativo 1','En espera',9,'bbbb2',NULL,NULL,'Pepe Lopez','Ford',0,'ida',NULL,NULL,NULL,NULL),(70,12015,'2026-07-14 10:49:00',-34.63973900,-71.36591600,'2026-07-14 10:50:00',-34.65274270,-71.19538190,'Nancagua, Provincia de Colchagua, Región del Libertador General Bernardo O\'Higgins, Chile','testeo fecha hora recomendada','sda',0,0,'2026-07-14 10:50:00','Pepe Lopez','Terminado',9,'bc1245',NULL,NULL,'Pepe Lopez','Suzuki',12015,'ida','viajes/inicio/viajes_inicio_1784040599591.jpg','viajes/fin/viajes_fin_1784040613528.jpg',NULL,'2026-07-15 14:15:00'),(71,12015,'2026-07-14 10:52:00',-34.65274270,-71.19538190,'2026-07-14 10:52:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde Nancagua, Provincia de Colchagua, Región del Libertador General Bernardo O\'Higgins, Chile','aaaa',0,0,'2026-07-14 10:52:00','Pepe Lopez','Terminado',9,'bc1245',NULL,NULL,'Pepe Lopez','Suzuki',12016,'vuelta','viajes/inicio/viajes_inicio_1784040728766.png','viajes/fin/viajes_fin_1784040739679.jpg',NULL,NULL),(72,123001,'2026-07-14 11:33:00',-34.98536800,-71.23937050,'2026-07-14 11:33:00',-34.63973900,-71.36591600,'Municipalidad','Regreso desde Curicó, Provincia de Curicó, Región del Maule, Chile','xczxc',0,0,'2026-07-14 11:33:00','Pepe Lopez','Terminado',9,'123',NULL,NULL,'Pepe Lopez','qwe',123005,'vuelta','viajes/inicio/viajes_inicio_1784043203356.jpg','viajes/fin/viajes_fin_1784043215957.jpg',NULL,NULL);
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

-- Dump completed on 2026-07-15  9:53:23
