"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  video.init(
    {
      videoid: { type: DataTypes.TEXT, allowNull: false, primaryKey: true },
      title: { type: DataTypes.TEXT, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false },
      thumbnail: { type: DataTypes.TEXT },
      filetype: { type: DataTypes.TEXT },
      sha256sum: { type: DataTypes.TEXT },
      tags: { type: DataTypes.ARRAY(DataTypes.TEXT) },
      length: { type: DataTypes.TEXT },
      quality: { type: DataTypes.TEXT },
      uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: "video",
      // TODO: disabled "createdAt" & "updatedAt" fields for now, will want to add later
      timestamps: false,
    }
  );
  return video;
};
