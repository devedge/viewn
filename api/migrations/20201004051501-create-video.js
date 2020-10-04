"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("videos", {
      videoid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.TEXT,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      location: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      thumbnail: {
        type: Sequelize.TEXT,
      },
      filetype: {
        type: Sequelize.TEXT,
      },
      sha256sum: {
        type: Sequelize.TEXT,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      length: {
        type: Sequelize.TEXT,
      },
      quality: {
        type: Sequelize.TEXT,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("videos");
  },
};
