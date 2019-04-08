import React from 'react';
import '../App.css';

const Card = ({info}) =>
 <div className="card">
   <a href={info.alt}>
      <div className="cover"><img  src={info.images.medium}  alt=""/></div>
      <div className="detail">
        <h2>{info.title}</h2>
        <div className="extra">
          <span className="score">{info.rating.average}</span>&nbsp;/&nbsp;
          <span className="collection">{info.collect_count}</span> 收藏
        </div>
        <div className="extra">
          <span className="year">{info.year}</span>&nbsp;/&nbsp;
          <span className="type">{info.genres.join('、')}</span>
        </div>
        <div className="extra">
          <span className="director">导演: {info.directors.map(i => i.name).join('、')}</span>
        </div>
        <div className="extra">
          <span className="casts">演员: {info.casts.map(i => i.name).join('、')}</span>
        </div>
        <div className="extra"></div>
      </div>
    </a>
  </div>

export default Card;