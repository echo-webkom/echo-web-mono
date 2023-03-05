import defaultResolve, { PublishAction } from 'part:@sanity/base/document-actions';
import SetAndPublishAction from './setAndPublishAction';

export default function resolveDocumentActions(props) {
    return defaultResolve(props).map((Action) => (Action === PublishAction ? SetAndPublishAction : Action));
}
