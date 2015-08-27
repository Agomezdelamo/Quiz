var models = require('../models/models.js');

//MW de estadisticas
exports.index = function(req,res,next){

  var statistics = {
    quizesCount: 0,         //El número de preguntas
    commentsCount: 0,       //El número de comentarios totales
    quizCommentAverage: 0,  //El número medio de comentarios por pregunta
    quizesWithoutComment: 0,//El número de preguntas sin comentarios
    quizesWithComment: 0    //El número de preguntas con comentarios
  };
//busco todos los que tengan como modelo el ORM comment
  models.Quiz.findAll({
            include: [{model: models.Comment }]
  }).then(function(results){//paso todos los ORM en un array y calculo la cantidad
	console.log("array de todas las quiz que en base de datos tenga comment",results);

      statistics.quizesCount = results.length;//paso la cuenta de quiz a la propiedad del objeto simple de estadisticas.

      for (var i in results) {
        if (results[i].Comments.length > 0) {
            statistics.commentsCount += results[i].Comments.length;
            statistics.quizesWithComment++;
        } else {
          statistics.quizesWithoutComment++;
        }
      }

      if(statistics.quizesCount > 0 && statistics.quizesCount > 0){
        statistics.quizCommentAverage = statistics.commentsCount / statistics.quizesCount;
        console.log("statistics.quizCommentAverage -> "+statistics.quizCommentAverage);
      }else{
        console.log("No se puede calcular la media");
      }

      console.log("statistics.quizesCount -> "+statistics.quizesCount);
      console.log("statistics.commentsCount -> "+statistics.commentsCount);
      console.log("statistics.quizCommentAverage -> "+statistics.quizCommentAverage);
      console.log("statistics.quizesWithComment -> "+statistics.quizesWithComment);
      console.log("statistics.quizesWithoutComment -> "+statistics.quizesWithoutComment);
      res.render('statistics/index.ejs', {statistics: statistics, errors:[]});
  }).catch(function(error){
    next(error);
  });;


};