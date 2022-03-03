CREATE DATABASE new_event;
USE new_event;

CREATE TABLE `compte` (
  `id_compte` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `naissance` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `no_telephone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `etat` int(11) NOT NULL DEFAULT 0,
  `img_profil` varchar(255) DEFAULT NULL,
  `notif_email` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_compte`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `evenement` (
  `id_evenement` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` varchar(2048) DEFAULT 'NULL',
  `departement` varchar(255) DEFAULT NULL,
  `debut` datetime NOT NULL,
  `fin` datetime NOT NULL,
  `archivage` int(11) NOT NULL DEFAULT 31,
  `etat` int(11) NOT NULL DEFAULT 0,
  `img_banniere` varchar(255) DEFAULT NULL,
  `id_proprietaire` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_evenement`),
  KEY `evenement_fk_proprio` (`id_proprietaire`),
  CONSTRAINT `evenement_fk_proprio` FOREIGN KEY (`id_proprietaire`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `participant` (
  `id_compte` int(10) unsigned NOT NULL DEFAULT 0,
  `id_evenement` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_compte`, `id_evenement`),
  KEY `participant_fk_eve` (`id_evenement`),
  CONSTRAINT `participant_fk_compte` FOREIGN KEY (`id_compte`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION,
    CONSTRAINT `participant_fk_eve` FOREIGN KEY (`id_evenement`) REFERENCES `evenement` (`id_evenement`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `besoin` (
  `id_besoin` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT '',
  `id_participant` int(10) unsigned NOT NULL,
  `id_evenement` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_besoin`),
  KEY `besoin_fk_participant` (`id_participant`),
  KEY `besoin_fk_evenement` (`id_evenement`),
  CONSTRAINT `besoin_fk_evenement` FOREIGN KEY (`id_evenement`) REFERENCES `evenement` (`id_evenement`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION,
    CONSTRAINT `besoin_fk_participant` FOREIGN KEY (`id_participant`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `modele_besoin` (
  `id_m_besoin` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_vrai_besoin` int(10) unsigned NOT NULL,
  `message` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id_m_besoin`),
  KEY `modele_besoin_fk_vraibesoin` (`id_vrai_besoin`),
  CONSTRAINT `modele_besoin_fk_vraibesoin` FOREIGN KEY (`id_vrai_besoin`) REFERENCES `besoin` (`id_besoin`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `modele_evenement` (
  `id_m_evenement` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_vrai_evenement` int(10) unsigned NOT NULL,
  `titre` varchar(255) DEFAULT NULL,
  `description` varchar(2048) DEFAULT NULL,
  `departement` varchar(255) DEFAULT NULL,
  `debut` datetime DEFAULT NULL,
  `fin` datetime DEFAULT NULL,
  `img_banniere` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_m_evenement`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `modele_invitation` (
  `id_m_invitation` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_participant` int(10) unsigned NOT NULL,
  `id_evenement` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_m_invitation`),
  KEY `modele_invitation_fk_parti` (`id_participant`),
  KEY `modele_invitation_fk_eve` (`id_evenement`),
  CONSTRAINT `modele_invitation_fk_eve` FOREIGN KEY (`id_evenement`) REFERENCES `evenement` (`id_evenement`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION,
    CONSTRAINT `modele_invitation_fk_parti` FOREIGN KEY (`id_participant`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `notification` (
  `id_notif` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `etat` int(11) NOT NULL DEFAULT 0,
  `recu` datetime NOT NULL,
  `id_type` int(10) unsigned NOT NULL,
  `id_compte` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_notif`),
  KEY `notification_fk_compte` (`id_compte`),
  CONSTRAINT `notification_fk_compte` FOREIGN KEY (`id_compte`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `notif_ajouter` (
  `id_n_ajouter` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `id_modele` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_n_ajouter`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `notif_message` (
  `id_n_message` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id_n_message`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `notif_supprimer` (
  `id_n_supprimer` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `id_modele` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_n_supprimer`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `notif_modifier` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `id_modele` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE `recuperation` (
  `id_recuperation` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token_date` datetime NOT NULL DEFAULT current_timestamp(),
  `token_id` varchar(255) NOT NULL,
  `id_compte` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_recuperation`),
  KEY `recuperation_fk_compte` (`id_compte`),
  CONSTRAINT `recuperation_fk_compte` FOREIGN KEY (`id_compte`) REFERENCES `compte` (`id_compte`) ON DELETE NO ACTION ON
  UPDATE
    NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4;










