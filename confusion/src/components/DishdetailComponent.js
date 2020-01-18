import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle } from 'reactstrap';

export class DishDetail extends Component {

    constructor(props) {
        super(props);
    }

    renderDish(dish) {
      if (dish != null)
          return(
              <Card>
                  <CardImg top src={dish.image} alt={dish.name} />
                  <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                  </CardBody>
              </Card>
          );
      else
          return(
              <div></div>
          );
    }

    renderComments(comments) {
      if (comments) {
        const renderedComments = comments.map((comment) => {
          const date = new Date(comment.date);
          return (
            <ul key={comment.id} className="list-unstyled">
              <li>{comment.comment}</li>
              <li>-- {comment.author}, {date.toLocaleDateString()}</li>
            </ul>

          )
        });

        return (
          <div>
              <h4>Comments</h4>
              {renderedComments}
          </div>

        );
      }

      return (
        <div></div>
      );
    }

    render() {
      return(
        <div className="row">
          <div  className="col-12 col-md-5 m-1">
            {this.renderDish(this.props.selectedDish)}
          </div>
          <div  className="col-12 col-md-5 m-1">
            {this.renderComments(this.props.selectedDish ? this.props.selectedDish.comments : null)}
          </div>
        </div>
      );

    }
}
