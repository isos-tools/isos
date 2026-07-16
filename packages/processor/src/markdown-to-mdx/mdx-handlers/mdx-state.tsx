import * as article from '../../plugins/article/mdx-state';
import * as maths from '../../plugins/maths/md-to-mdx/mdx-state';

export type MdxDefaultState = {
  article: article.ArticleStateType;
  maths: maths.MathsStateType;
};

const initialState: MdxDefaultState = {
  article: article.articleInitial,
  maths: maths.mathsInitial,
};

export type MdxState = {
  article: article.ArticleState;
  maths: maths.MathsState;
};

export function createMdxState(): MdxState {
  return {
    article: article.articleSignalState(initialState.article),
    maths: maths.mathsSignalState(initialState.maths),
  };
}
