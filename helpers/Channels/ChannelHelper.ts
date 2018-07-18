import {GlobalService} from "../../services/global.service";
import {ResponseApi} from "../../models/interfaces/responseApi.interface";
import {FeedService} from '../../services/feeds.service';
/**
 * Created by t_mit on 5/22/2017.
 */
export class ChannelHelper {

    getFilesChannel(globalService: GlobalService, feedService: FeedService, key, page) {
        return new Promise((resolve, reject) => {
            globalService.getRquest(
                `${globalService.apiUrl}channels/${key}/files`, {
                    'filter[filetype][]': feedService.filter,
                    page: page
                },
            ).subscribe(
                (isSuccess: ResponseApi ) => {
                    globalService.paginateFeeds.push(... isSuccess.response_data);
                    resolve(true);
                }, error2 => {
                    reject(true);
                }
            )
        });

    }
}