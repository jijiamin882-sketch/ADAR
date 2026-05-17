import React from "react";
import './PropertyCard.css'
import {AiFillHeart} from 'react-icons/ai'
import {truncate} from 'lodash'
import { useNavigate } from "react-router-dom";
import Heart from "../Heart/Heart";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const PropertyCard = ({card}) => {
  const { t } = useTranslation(); // تعريف الترجمة
  const navigate = useNavigate();
  
  return (
    <div className="flexColStart r-card"
    onClick={()=>navigate(`../properties/${card.id}`)}
    >
      <Heart id={card?.id}/>
      <img src={card.img} alt={t('card_img_alt')} />
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>{t('card_currency_symbol')}</span>
        <span>{card.price}</span>
      </span>
      <span className="primaryText">{truncate(card.title, {length: 15})}</span>
      <span className="secondaryText">{truncate(card.description, {length: 80})}</span>
    </div>
  );
};

export default PropertyCard;